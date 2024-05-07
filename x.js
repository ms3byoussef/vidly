//POST /api/returns   {customerId,movieId}
//
// Return 401 if client is not logged in
// Return 400 if customerId not provided
// Return 400 if movieId not provided
// Return 404 if rental founded for this customer/movie
// Return 404 if rental already processed
// Return 200 if valid request
// set return date
//calculate the return fee
// increase the stock 
//  return the rental

