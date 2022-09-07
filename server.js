const fs = require('fs');
const express = require('express');
class Contenedor{
    constructor(name){
        this.name = name;
    }


    async getAll(){
        try{
            var content = await fs.promises.readFile(`./${this.name}`,'utf-8');
            var objetos = JSON.parse(content);

        }
        catch (error){
            console.log(error);
        }
        return objetos;
    }

    async getRandomProduct(){
        try{
            const content = await this.getAll();
            const productRandom = content[Math.floor(Math.random() * content.length)];
            return productRandom;
        }
        catch(error){
            console.log(error);
        }
    }

    async save(obj){
        try{
            let objetos = await this.getAll();
            if(objetos.length > 0){
                let ultimoIndice = objetos.length - 1;
                let ultimoId = objetos[ultimoIndice].id;
                obj.id = ultimoId + 1; 
            }else{
                obj.id = 1;
            }
            objetos.push(obj);
            let json = JSON.stringify(objetos);
            await fs.promises.writeFile(`./${this.name}`, json);

            console.log(obj.id);
        }
        catch(error){
            console.log(error);
        }
        
        
    }

    async getById(number){
        try{
            let objetos = await this.getAll();
            var res = null;
            objetos.forEach(element => { 
                if(element.id === number){
                    res = element; 
                }
            });
            
            console.log(res);

        }
        catch(error){
            console.log(error);
        }
    }

    async deleteById(number){
        try{
            let objetos = await this.getAll();
            let objetosActualizados = objetos.filter((element) => element.id !== number);
            await fs.promises.writeFile(`./${this.name}`, JSON.stringify(objetosActualizados));


        }
        catch(error){
            console.log(error);
        }
    }

    async deleteAll(){
        try{
            let objetos = new Array();
            await fs.promises.writeFile(`./${this.name}` , JSON.stringify(objetos));
        }
        catch(error){
            console.log(error);
        }
    }
}

const contenedor = new Contenedor('objetos.json');

//inicializo 
const app = express();
//indico el puerto a usar
const port = 8080;
const server = app.listen(port, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", error=>console.log(`Error en el servidor ${error}`));

app.get('/productos', async (req,res) => {
    contenedor.getAll().then((products) => res.send(products))
});

app.get('/productoRandom', async (req, res) => {
    contenedor.getRandomProduct().then((product) => res.send(product))
})

app.get('*' , async (req, res) => {
    res.send('<a href="/productos">lista de productos</a> <a href="/productoRandom">producto random</a>')
})






