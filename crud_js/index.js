const express = require('express');
const exphbs  = require('express-handlebars');
const pool    = require('./db/conn');
const app     = express();

const hbs     = exphbs.create([{
    partialsDir: ['views/partials']
}])

app.use(express.static('public'));
app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');
app.set('views','./views');

app.use(express.urlencoded({
    extended: "true"
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.redirect('/list');
})
app.get('/add',(req,res)=>{
    res.render('add');
})
app.get('/list',(req,res)=>{
    const sql = `select * from user`
    pool.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        
        data.forEach(function(obj){
            switch(obj.gender){
                case 'm':
                    obj.gender = 'Masculino'
                    break;
                case 'f':
                    obj.gender = 'Feminino'
                    break;
                case 'n':
                    obj.gender = 'Outro'
                    break;
                default:
            }
        })
        list = data;
        res.render('list',{list});
    })
})
app.post('/list/search',(req,res)=>{
    const search = req.body.search;
    const sql = `SELECT * FROM user WHERE name LIKE '%${search}%'`;
    pool.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        data.forEach(function(obj){
            switch(obj.gender){
                case 'm':
                    obj.gender = 'Masculino';
                    break;
                case 'f':
                    obj.gender = 'Feminino';
                    break;
                case 'n':
                    obj.gender = 'Outro';
                    break;
                default:
                    obj.gender = 'Outro';
            }
        })
        list = data;
        res.render('list',{list});
    })
})
app.get('/edit',(req,res)=>{
    const id = req.query.id;  
    const sql = `SELECT * FROM user WHERE id = '${id}'`
    pool.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            return
        }
        data = data[0];
        let data2;
        switch(data.gender){
            case 'm':
                data2 = {checkm: 'checked',checkf: '',checkn: ''};
                break;
            case 'f':
                data2 = {checkm: '',checkf: 'checked',checkn: ''};
                break;
            case 'n':
                data2 = {checkm: '',checkf: '',checkn: 'checked'};
                break;
            default: 
                data2 = {checkm: '',checkf: '',checkn: 'checked'};
                break;
        }
         
        res.render('edit',{data,data2});
    })
})
app.get('/details',(req,res)=>{
    const id = req.query.id;
    const sql = `SELECT * FROM user WHERE id = '${id}'`;
    
    pool.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        data.forEach(function(obj){
            switch(obj.gender){
                case 'm':
                    obj.gender = 'Masculino';
                    break;
                case 'f':
                    obj.gender = 'Feminino';
                    break;
                case 'n':
                    obj.gender = 'Outro';
                    break;
                default:
                    obj.gender = 'Outro';
            }
        })
        info = data[0];
        res.render('details',{info});
    })
})

app.post('/edit/update',(req,res)=>{
    const id     = req.body.id;
    const name   = req.body.name;
    const gender = req.body.gender;
    const phone  = req.body.phone;
    const email  = req.body.email;
    const sql    = `UPDATE user SET name = '${name}', gender = '${gender}', phone = '${phone}', email = '${email}' where id = '${id}'`;

    pool.query(sql,(err)=>{
        if(err){
            console.log(err);
            return;
        }
        res.redirect('/list');
    })
})

app.post('/delete',(req,res)=>{
    const id  = req.body.id;
    const sql = `DELETE FROM user WHERE id = '${id}'`;
    pool.query(sql,(err)=>{
        if(err){
            console.log(err);
            return;
        }
        res.redirect('/list');
    })
})

app.post('/add/insert',(req,res)=>{
    const name   = req.body.name;
    const gender = req.body.gender;
    const phone  = req.body.phone;
    const email  = req.body.email;

    const sql = ` insert into user (name,gender,phone,email)values('${name}','${gender}','${phone}','${email}')`;

    pool.query(sql,(err)=>{
        if(err){
            console.log(err);
            return;
        }
        res.redirect('/list');
    });
});

app.listen(3000);