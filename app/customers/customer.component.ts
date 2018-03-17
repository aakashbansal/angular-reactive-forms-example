import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {

    customerForm: FormGroup;
    emailMessage: string;

    get addresses(): FormArray {
        return <FormArray>this.customerForm.get('addresses');
    }
    private emailValidationMessages = {
        required: 'Please enter your email address',
        pattern: 'Please enter a valid email address'
    }
    customer: Customer = new Customer();
    constructor(private fb: FormBuilder) {

    }

    ngOnInit() {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', Validators.required]
            }, { validator: emailMatcher }),
            phone: '',
            rating: ['', ratingRange(1, 5)],
            notification: 'email',
            sendCatalog: true,
            addresses: this.fb.array([this.buildAddress()]),
        });

        this.customerForm.get('notification').valueChanges
            .subscribe(value => { this.setNotification(value); })

        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1000).subscribe(value => {
            this.setValidationMessage(emailControl);
        })
    }
    save(): void {
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    buildAddress() {
        return this.fb.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    }

    addAddress(): void {
        this.addresses.push(this.buildAddress());
    }
    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();

    }

    setValidationMessage(c: AbstractControl): void {
        this.emailMessage = '';

        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(keys =>
                this.emailValidationMessages[keys]).join(' ');
        }
    }

}

function ratingRange(min: number, max: number): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'range': true };
        }
        return null;
    };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {

    let email = c.get('email');
    let confirmEmail = c.get('confirmEmail');

    if (email.pristine || confirmEmail.pristine) {
        return null;
    }

    if (email.value === confirmEmail.value) {
        return null;
    }

    return { 'match': true };

}