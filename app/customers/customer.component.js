"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var customer_1 = require('./customer');
var forms_1 = require('@angular/forms');
require('rxjs/add/operator/debounceTime');
var CustomerComponent = (function () {
    function CustomerComponent(fb) {
        this.fb = fb;
        this.emailValidationMessages = {
            required: 'Please enter your email address',
            pattern: 'Please enter a valid email address'
        };
        this.customer = new customer_1.Customer();
    }
    Object.defineProperty(CustomerComponent.prototype, "addresses", {
        get: function () {
            return this.customerForm.get('addresses');
        },
        enumerable: true,
        configurable: true
    });
    CustomerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.customerForm = this.fb.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', forms_1.Validators.required]
            }, { validator: emailMatcher }),
            phone: '',
            rating: ['', ratingRange(1, 5)],
            notification: 'email',
            sendCatalog: true,
            addresses: this.fb.array([this.buildAddress()]),
        });
        this.customerForm.get('notification').valueChanges
            .subscribe(function (value) { _this.setNotification(value); });
        var emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1000).subscribe(function (value) {
            _this.setValidationMessage(emailControl);
        });
    };
    CustomerComponent.prototype.save = function () {
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    };
    CustomerComponent.prototype.buildAddress = function () {
        return this.fb.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    };
    CustomerComponent.prototype.addAddress = function () {
        this.addresses.push(this.buildAddress());
    };
    CustomerComponent.prototype.setNotification = function (notifyVia) {
        var phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(forms_1.Validators.required);
        }
        else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    };
    CustomerComponent.prototype.setValidationMessage = function (c) {
        var _this = this;
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(function (keys) {
                return _this.emailValidationMessages[keys];
            }).join(' ');
        }
    };
    CustomerComponent = __decorate([
        core_1.Component({
            selector: 'my-signup',
            templateUrl: './app/customers/customer.component.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder])
    ], CustomerComponent);
    return CustomerComponent;
}());
exports.CustomerComponent = CustomerComponent;
function ratingRange(min, max) {
    return function (control) {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'range': true };
        }
        return null;
    };
}
function emailMatcher(c) {
    var email = c.get('email');
    var confirmEmail = c.get('confirmEmail');
    if (email.pristine || confirmEmail.pristine) {
        return null;
    }
    if (email.value === confirmEmail.value) {
        return null;
    }
    return { 'match': true };
}
//# sourceMappingURL=customer.component.js.map