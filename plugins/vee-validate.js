import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', {
	...required,
	message: 'This field is required'
});

extend('email', {
	...email,
	message: 'This field must only contain a valid e-mail address'
});
