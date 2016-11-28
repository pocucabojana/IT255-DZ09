import { Component, Directive } from 'angular2/core';
import {Component, FormBuilder, Validators, ControlGroup, Control, FORM_DIRECTIVES, FORM_BINDINGS} from 'angular2/common'
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import 'rxjs/Rx';
import {Router, ROUTER_PROVIDERS} from 'angular2/router'

@Component({ 
  selector: 'RegisterPage', 
  templateUrl: 'app/register/register.html',
  directives: [FORM_DIRECTIVES],
  viewBindings: [FORM_BINDINGS]
})

export class RegisterComponent { 

  registerForm: ControlGroup;
  http: Http;
  router: Router;
  postResponse: String;
  
  constructor(builder: FormBuilder, http: Http,  router: Router) {
	this.http = http;
	this.router = router;
    this.registerForm = builder.group({
     username: ["", Validators.none],
        email: ["", Validators.none],
     password: ["", Validators.none],

   });
   
   if(localStorage.getItem('token') != null){
		 this.router.parent.navigate(['./LoginPage']);
   }
   
  }
    onRegister(): void {
        var data = "username="+this.registerForm.value.username+"&password="+this.registerForm.value.password+"&email="+this.registerForm.value.email;
        var headers = new Headers();
        
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post('http://localhost/php/registerservice.php',data, {headers:headers})
            .map(res => res)
            .subscribe( data => this.postResponse = data,
                err => alert(JSON.stringify(err)),
                () => {
                    alert(this.postResponse._body);
                    if(this.postResponse._body.indexOf("error") === -1){
                        var obj = JSON.parse(this.postResponse._body);
                        localStorage.setItem('token', obj.token);
                        this.router.parent.navigate(['./LoginPage']);
                    }else{
                        var obj = JSON.parse(this.postResponse._body);
                        document.getElementsByClassName("alert")[0].style.display = "block";
                        document.getElementsByClassName("alert")[0].innerHTML = obj.error.split("\\r\\n").join("<br/>").split("\"").join("");
                    }
                }
            );

    }

}
