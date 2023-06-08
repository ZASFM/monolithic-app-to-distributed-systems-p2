const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require('../utils/app-errors');

// All Business logic will be here
class ProductService {

    constructor(){
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs){
        try{
            const productResult = await this.repository.CreateProduct(productInputs)
            return FormateData(productResult);
        }catch(err){
            throw new APIError('Data Not found')
        }
    }
    
    async GetProducts(){
        try{
            const products = await this.repository.Products();
    
            let categories = {};
    
            products.map(({ type }) => {
                categories[type] = type;
            });
            
            return FormateData({
                products,
                categories:  Object.keys(categories) ,
            })

        }catch(err){
            throw new APIError('Data Not found')
        }
    }


    async GetProductDescription(productId){
        try {
            const product = await this.repository.FindById(productId);
            return FormateData(product)
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetProductsByCategory(category){
        try {
            const products = await this.repository.FindByCategory(category);
            return FormateData(products)
        } catch (err) {
            throw new APIError('Data Not found')
        }

    }

    async GetSelectedProducts(selectedIds){
        try {
            const products = await this.repository.FindSelectedProducts(selectedIds);
            return FormateData(products);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetProductById(productId){
        try {
            return await this.repository.FindById(productId);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }
     
    async GetProductPayload(userId,{productId,qty},event){
       const product=await this.repository.FindById(productId);
       if(product){
          const payload={
            event,
            data:{userId,product,qty}
          }
          return FormateData(payload);
       }
       return FormateData({message:'Error no product'})
    }

    //product service awaits a payload from shopping requesting something and will trigger some function acording to the type:
    async serveRPCRequest(payload){
        const {data,type}=payload;

        switch(type){
            case 'VIEW PRODUCT':
               return this.repository.FindById(data);
               break;
            case 'VIEW PRODUCTS':
                return this.repository.FindSelectedProducts(data);
                break;
            default:
                break;
        }
    }
}

module.exports = ProductService;