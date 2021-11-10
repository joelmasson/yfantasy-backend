## To Start Mongo
```
brew services start mongodb-community@5.0
```

To run ngrok
```
ngrok http --host-header=rewrite 8080
````
To reset all timestamps to dateTime
```
db.playbyplays.updateMany(
    {
       "timestamp":{
          "$type":"string"
       }
    },
    [
       {
          "$set":{
             "timestamp":{
                "$dateFromString":{
                   "dateString":"$timestamp",
                }
             }
          }
       }
    ]
 )
 ```