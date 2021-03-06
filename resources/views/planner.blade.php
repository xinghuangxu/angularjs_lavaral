<?php
/**
 * @author Randall Crock
 * @copyright 2016 NetApp, Inc.
 * @date 2016-01-04
 */
?>
<!DOCTYPE html>
<html id="ng-app" ng-app="spark">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <link rel="icon" type="image/vnd.microsoft.icon" href="../favicon.ico" />

        @include('includes.head')
        <!-- Stylesheets -->
        <link rel="stylesheet" type="text/css" href="{{ asset('css/planning.css') }}" />
        <link rel="stylesheet" type="text/css" href="{{ asset('css/testStrategy.css') }}" />

        <title>Spark &gt; Test Planning</title>
    </head>
    <body class="container-fluid scroll">
        @include('includes.header')
        <!-- Primary data container -->
        <div id="main-view" ng-view></div>

        @include('includes.footer')

        <!-- App scripts -->

        <script type="text/javascript" src="{{ asset('angular/spark.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/ui/ui.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/ui/resizable.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/ui/jstree.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/ui/node.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/ui/flash.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/alm/alm.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/alm/alm.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/cq/cq.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/cq/cq.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/boxcar/boxcar.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/boxcar/boxcar.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/common/common.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/common/common.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/common/common.filters.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/common/confirm.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/common/arrayValidator.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/planner.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/planner.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/globalFilter.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/settings/settings.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/settings/settings.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/settings/settings.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/boxcar/boxcar.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/boxcar/boxcar.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/boxcar/boxcar.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/testplan/testplan.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/testplan/testplan.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/planner/testplan/testplan.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/testStrategy.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/testStrategy.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/testStrategy.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/editor/editor.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/editor/editor.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/editor/editor.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/viewer/viewer.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/viewer/viewer.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/viewer/viewer.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/search/search.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testStrategy/search/search.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testplan/testplan.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testplan/testplan.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/nav/nav.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/nav/nav.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/auth/auth.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/auth/auth.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/auth/login.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/error/error.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/error/error.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/tag/tag.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/tag/tag.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/tag/tag.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/requirements/requirements.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/requirements/requirements.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/requirements/requirements.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testcase/testcase.module.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testcase/testcase.services.js') }}"></script>
        <script type="text/javascript" src="{{ asset('angular/testcase/testcase.js') }}"></script>

        <!-- Misc Scripts -->
    </body>
</html>
