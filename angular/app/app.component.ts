import {Component} from 'angular2/core';
import {RouteConfig,Router, ROUTER_DIRECTIVES} from 'angular2/router';
import { RegisterComponent } from 'app/register/register.component';
import { LoginComponent}  from 'app/login/login.component';
import {Pipe} from 'angular2/core';
import {OnePageComponent} from "./onepage/onepage.component";
import {SearchPageComponent} from "./searchpage/search.component";

@Component({
    selector: 'moja-aplikacija',
	templateUrl: 'app/router.html',
	directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
	{path:'/', name:'LoginPage', component: LoginComponent, useAsDefault: true},
	{path:'/register', name:'RegisterPage', component: RegisterComponent},
	{path:'/onepage', name: 'OnePage', component: OnePageComponent},
	

])

export class AppComponent { 
	router: Router;
	isAuth: String;
	
	constructor(router: Router) {
		this.router = router;
		  router.subscribe((val) => {
		  if(localStorage.getItem('token') !== null){
				this.isAuth = "yes";
		  }else{
			    this.isAuth = "no";
		  }
		  });
	}
	
 onLogout(): void {
	localStorage.removeItem("token");
	 this.router.navigate(['./LoginPage']);
	if(localStorage.getItem('token') !== null){
		this.isAuth = "yes";
	}else{
		this.isAuth = "no";
	}
 }
}
