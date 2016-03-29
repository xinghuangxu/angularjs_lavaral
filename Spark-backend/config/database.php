<?php


// Create list of ALM database connections from comma-delimited definition list in environment.
// The DB definitions are formatted as <db_name>:<Friendly Name> (without the angle brackets)
$almDbDefinitions = explode( ',' , env('ALM_DATABASES') );
$almConnections = [];
foreach($almDbDefinitions as $almDbDefinition) {
    $definitionSplit = explode(':', $almDbDefinition);

    $dbName = array_shift($definitionSplit);
    $dbDescription = array_shift($definitionSplit);

    $almConnections["alm_$dbName"] = array(
        'database' => $dbName,
        'description' => $dbDescription,
        'driver'   => 'sqlsrv',
        //'host'     => env('ENG_DB_HOST'),
        'host'     => env('TATTDBPROD_HOST'),
        'username' => env('ALM_DB_USERNAME'),
        'password' => env('ALM_DB_PASSWORD'),
    );
}

if(env('APP_ENV') == 'local') {
    $almConnections["alm_tattdb_mark_test"] = array(
        'database' => 'tattdb_mark_test',
        'description' => 'Poor dev flavor of ALM',
        'driver' => 'sqlsrv',
        'host' => env('ENG_DB_DEV_HOST'),
        'username' => env('TATTDB_USERNAME'),
        'password' => env('TATTDB_PASSWORD'),
    );
}

return [
    'fetch' => PDO::FETCH_CLASS,
    'default' => 'tattdb',

    'connections' => array_merge ([
        'tattdb' => array(
            'driver'   => 'sqlsrv',
            'host'     => env('TATTDB_HOST'),
            'database' => env('TATTDB_DATABASE'),
            'username' => env('TATTDB_USERNAME'),
            'password' => env('TATTDB_PASSWORD'),
        ),
        'cq_mirror' => array(
            'driver'   => 'sqlsrv',
            'host'     => (env('APP_ENV') == 'local') ? env('ENG_DB_DEV_HOST'): env('ENG_DB_HOST'),
            'database' => env('CQ_MIRROR_DATABASE'),
            'username' => env('TATTDB_USERNAME'),
            'password' => env('TATTDB_PASSWORD'),
        ),
    ], $almConnections),


    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    | NOTE: CURRENTLY NOT BEING USED IN SPARK
    */

    'migrations' => 'migrations',

];
