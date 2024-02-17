import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

type Severity = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
    severity: Severity;
    title: string;
    message: string;
    duration: number;
}

const AlertComponent: React.FC<AlertProps> = ({ severity, title, message, duration }) => (
    <Snackbar autoHideDuration={duration}>
        <Alert severity={severity}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    </Snackbar>
);

export default AlertComponent;