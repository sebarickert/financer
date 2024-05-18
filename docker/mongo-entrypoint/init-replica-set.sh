# Important: This file doesn't perform any operations. Hence, the use of a healthcheck script is required.
# The reason it doesn't perform any operations is because initialization scripts are run prior to the actual database startup in replication mode.

if [ "$MONGO_INITDB_ROOT_USERNAME" ] && [ "$MONGO_INITDB_ROOT_PASSWORD" ]; then
"${mongo[@]}" "$MONGO_INITDB_DATABASE" <<-EOJS
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "mongodb:27017" }
    ]
})
EOJS
fi

echo ======================================================
echo initiated replica set with $MONGO_INITDB_ROOT_USERNAME in database $MONGO_INITDB_DATABASE
echo ======================================================
