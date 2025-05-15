// src/components/PasswordField.tsx
import React, { Component } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
    /** The current password value */
    value: string;
    /** Change handler: e.g. e => setPassword(e.target.value) */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Optional field label (defaults to "Password") */
    label?: string;
}

interface PasswordFieldState {
    /** Whether the password is visible */
    showPassword: boolean;
}

export class PasswordField extends Component<
    PasswordFieldProps,
    PasswordFieldState
> {
    constructor(props: PasswordFieldProps) {
        super(props);
        this.state = { showPassword: false };
    }

    toggleShow = () => {
        this.setState(({ showPassword }) => ({ showPassword: !showPassword }));
    };

    render() {
        const { label = 'Password', value, onChange } = this.props;
        const { showPassword } = this.state;

        return (
            <TextField
                fullWidth
                required
                label={label}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={this.toggleShow}
                                edge="end"
                                aria-label={
                                    showPassword ? 'Hide password' : 'Show password'
                                }
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        );
    }
}

export default PasswordField;
