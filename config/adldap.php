<?php
/***
 * author: mpadding
 * purpose: Defines all the Active Directory via LDAP connection parameters needed for our environment.
 */
return [
    'account_suffix' => '@netapp',
    'domain_controllers' => array('xyz.com'),
    'base_dn' => 'DC=abc,DC=xyz,DC=com',
    'admin_username' => 'xyz',
    'admin_password' => 'xyz',
    'use_ssl' => false,
    'use_tls' => false,
    'recursive_groups' => false,
];
