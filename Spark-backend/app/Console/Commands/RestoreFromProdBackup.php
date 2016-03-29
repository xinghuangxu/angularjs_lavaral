<?php namespace Spark\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use DB;
use PDO;
use PDOException;

class RestoreFromProdBackup extends Command {

    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'db:restore-from-prod';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restores the database in .env as TATTDB_DATABASE from the latest production backup';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function fire()
    {
        $server = env('TATTDB_HOST');
        $database = env('TATTDB_DATABASE');
        $backupFile = $this->getLatestBackupFile();

        if ( $backupFile == null ) {
            echo "Error: couldn't find backup files through server: $server\n";
            return;
        }

        echo "\n";
        $this->error('************************');
        $this->error('*****  WARNING!!!  *****');
        $this->error('************************');
        echo "\n";
        echo "This will delete all data in this database: $database\n";
        echo "On this server: $server\n";
        echo "And replace it with data from this backup: $backupFile\n";
        echo "\n";

        if ($this->confirm('Do you wish to continue? [yes|no]'))
        {
            $pdo = new PDO(
                getenv('MSSQL_PDO_PREFIX') . $server . ';' . getenv('MSSQL_DATABASE_SPECIFIER') . '=master',
                'bdt_handler',
                'not1_bug'
            );

            try {
            	$query1 = "ALTER DATABASE [$database] SET SINGLE_USER WITH ROLLBACK IMMEDIATE";

            	echo $query1;
                //$pdo->query($query1);

            	$query2 = "
                    RESTORE DATABASE [$database]
                    FROM DISK = N'$backupFile' WITH FILE = 1,
                    MOVE N'tattdb' TO N'F:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\Data\\" . $database . ".mdf',
                    MOVE N'tattdb_log' TO N'G:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\Data\\" . $database . "_1.ldf',
                    NOUNLOAD, REPLACE, STATS = 10";

                echo $query2;
                //$pdo->query($query2);
            }
            catch (PDOException $e) {
                echo "Restore failed: " . $e->getMessage();
            }

            $this->info("\nRestore completed successfully");
        }
    }

    private function getLatestBackupFile()
    {
        // Get listing of all backup files in the backup directory
        $backupDir = '\\\\wicengvflr02.eng.netapp.com\sqlback\tattdb';
        $results = DB::connection('tattdb')->getPdo()->query("
            EXEC xp_dirtree '$backupDir',1,1
        ");

        // Extract just the filenames into their own array
        $backupFiles = [];
        foreach ($results->fetchAll() as $row) {
            if ( $row['file'] == 1 ) {
                $backupFiles[] = $row['subdirectory'];
            }
        }

        // Sort the filenames in descending order (they're timestamped)
        rsort($backupFiles);

        // Get the first element from the list (should be the latest)
        if ( count($backupFiles) > 0 ) {
            return $backupDir . '\\' . $backupFiles[0];
        }
        else {
            return null;
        }
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [
            //['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }

}
