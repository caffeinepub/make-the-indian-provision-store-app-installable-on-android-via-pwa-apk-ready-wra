import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Include the mixin for the authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ProductCategory = {
    #fruits;
    #vegetables;
    #spices;
    #groceries;
    #snacks;
    #beverages;
    #householdToiletries;
  };

  public type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    category : ProductCategory;
  };

  public type UserProfile = {
    name : Text;
  };

  public type BuyerProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let buyerProfiles = Map.empty<Principal, BuyerProfile>();

  private func isAuthorizedForProductMutations(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or AccessControl.hasPermission(accessControlState, caller, #user)
  };

  public shared ({ caller }) func addProduct(id : Nat, name : Text, price : Nat, category : ProductCategory) : async () {
    if (not isAuthorizedForProductMutations(caller)) {
      Runtime.trap("Unauthorized: Only authorized vendors or admins can add products");
    };
    let product : Product = {
      id;
      name;
      price;
      category;
    };
    products.add(id, product);
  };

  public shared ({ caller }) func updateProductPrice(id : Nat, newPrice : Nat) : async () {
    if (not isAuthorizedForProductMutations(caller)) {
      Runtime.trap("Unauthorized: Only authorized vendors or admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with price = newPrice };
        products.add(id, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func assignVendor(user : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public shared ({ caller }) func removeVendor(user : Principal) : async () {
    AccessControl.assignRole(accessControlState, caller, user, #guest);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerBuyerProfile() : async ?BuyerProfile {
    if (AccessControl.getUserRole(accessControlState, caller) == #guest) {
      Runtime.trap("Unauthorized: Only authenticated users can access buyer profiles");
    };
    buyerProfiles.get(caller);
  };

  public query ({ caller }) func getBuyerProfile(buyer : Principal) : async ?BuyerProfile {
    if (caller != buyer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    buyerProfiles.get(buyer);
  };

  public shared ({ caller }) func saveCallerBuyerProfile(profile : BuyerProfile) : async () {
    if (AccessControl.getUserRole(accessControlState, caller) == #guest) {
      Runtime.trap("Unauthorized: Only authenticated users can save buyer profiles");
    };
    buyerProfiles.add(caller, profile);
  };
};
