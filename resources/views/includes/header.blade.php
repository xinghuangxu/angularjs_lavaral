<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="/"><img class="logo" src="{{ asset('images/logo-dark.png') }}" /></a>
        </div>
        <ul ng-controller="NavUser as user" class="nav navbar-nav navbar-right">
            <li>
                <a href="" data-animation="am-fade"
                        data-placement="bottom-right"
                        data-html="true"
                        bs-dropdown
                        aria-haspopup="true"
                        aria-expanded="false">
                    <span class="glyphicon glyphicon-user"></span> @{{user.svc.user.Fullname || "Welcome"}} <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" role="menu">
                    <li ng-hide="user.svc.user">
                        <a ng-click="user.login()"><i class='glyphicon glyphicon-log-in'></i> Login</a>
                    </li>
                    <li ng-show="user.svc.user">
                        <a ng-click="user.logout()"><i class='glyphicon glyphicon-log-out'></i> Logout</a>
                    </li>
                    <li>
                        <a href="http://ictwiki.eng.netapp.com/index.php/QA_Automation/Support/Self-Help/Spark_Online_Help" target="_blank">
                            <i class='glyphicon glyphicon-question-sign'></i> Help
                        </a>
                    </li>
                    <li>
                        <a ><i class='glyphicon glyphicon-fire'></i> Bugs</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</nav>