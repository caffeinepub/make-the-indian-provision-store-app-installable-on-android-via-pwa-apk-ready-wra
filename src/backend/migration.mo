import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldProduct = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
  };

  type NewProductCategory = {
    #fruits;
    #vegetables;
    #spices;
    #groceries;
    #snacks;
    #beverages;
    #householdToiletries;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    price : Nat;
    category : NewProductCategory;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          category = #groceries; // Default to groceries for all old products
        };
      }
    );
    { products = newProducts };
  };
};
