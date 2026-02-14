/**
 * Utility to normalize backend and agent errors into clear English messages
 */

export function normalizeActorError(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message;

    // Check for common authorization errors
    if (message.includes('Unauthorized') || message.includes('unauthorized')) {
      if (message.includes('vendor') || message.includes('admin')) {
        return 'You do not have permission to perform this action. Please contact an administrator to grant you vendor access.';
      }
      return 'You are not authorized to perform this action.';
    }

    // Check for actor initialization errors
    if (message.includes('Actor not initialized') || message.includes('Actor not available')) {
      return 'Connection to the backend is not ready. Please wait a moment and try again.';
    }

    // Check for product-specific errors
    if (message.includes('Product not found')) {
      return 'The product you are trying to update does not exist.';
    }

    if (message.includes('already exists')) {
      return 'A product with this ID already exists. Please use a different ID.';
    }

    // Check for validation errors
    if (message.includes('invalid') || message.includes('Invalid')) {
      return 'Invalid input provided. Please check your data and try again.';
    }

    // Return the original message if it's already clear
    if (message.length > 0 && message.length < 200) {
      return message;
    }
  }

  // Handle string errors (trap messages)
  if (typeof error === 'string') {
    if (error.includes('Unauthorized') || error.includes('unauthorized')) {
      return 'You do not have permission to perform this action. Please contact an administrator to grant you vendor access.';
    }
    if (error.includes('Product not found')) {
      return 'The product you are trying to update does not exist.';
    }
    if (error.includes('already exists')) {
      return 'A product with this ID already exists. Please use a different ID.';
    }
    return error;
  }

  // Handle objects with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return normalizeActorError((error as { message: unknown }).message);
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
}
