#/bin/bash

# The platform information we're currently on
uname=`uname`

# List of directories to make writable by the web server
writeable_dirs[0]='storage'
writeable_dirs[1]='bootstrap/cache'

# Check if composer is installed and create the autoload files
if command -v composer >/dev/null 2>&1 ; then
    composer install
else
    echo "Composer is required for installing Spark. Please install it and re-run setup"
    exit 1
fi

# Create environment files if needed
if [ ! -e .env ]; then
    cp .env.example .env
    echo "You will need to set up your .env file. Be sure to correctly set the driver and database information."
fi

if [[ ${uname} == 'Linux' ]]; then
    # Set apache options for this directory
    # if [ ! -e .htaccess ]; then
    #    cp .htaccess.example .htaccess
    #    echo "If this is a development environment, you may need to edit the 'RewriteBase' directive in the .htaccess file if you are using apache"
    # fi

    # Set the permissions correctly on the writable directories
    for dir in ${writeable_dirs[@]}; do
        # If the system supports ACLs, add permissions for apache
        if command -v setfacl >/dev/null 2>&1 ; then
            find ${dir} -type d -exec setfacl -m u:apache:rwx {} \;
            find ${dir} -type f -exec setfacl -m u:apache:rw {} \;
        # Otherwise, assumes the apache user is in the same group as is set for the files
        else
            find ${dir} -type d -exec chmod 775 {} \;
            find ${dir} -type f -exec chmod 664 {} \;
        fi

        # If selinux contexts are in use, set them so apache can write
        if command -v chcon >/dev/null 2>&1 ; then
            chcon -R --type=httpd_sys_rw_content_t ${dir}
        fi
    done
fi
