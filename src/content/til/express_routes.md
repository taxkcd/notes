---
title: Express routes
date: 2025-11-12
---

## Introduction


In Node the order of routes matter. users/me route below would not work.

``` javascript



router.get('/users/:id', async (req, res) => {
    
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }        
        return res.status(200).send(user)
    }catch(e){
        res.status(404).send(e)
    }
})

```

Instead it gives this error 


``` json
{
    "stringValue": "\"me\"",
    "valueType": "string",
    "kind": "ObjectId",
    "value": "me",
    "path": "_id",
    "reason": {},
    "name": "CastError",
    "message": "Cast to ObjectId failed for value \"me\" (type string) at path \"_id\" for model \"User\""
}

```




But the below would work

``` javascript



router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    
    try{
        const _id = req.params.id
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }        
        return res.status(200).send(user)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

```




``` javascript

works 
res.status(201).send({me, token})

does not
res.status(201).send(me, token)


```