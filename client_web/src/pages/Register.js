import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode';

import {
    register,
    getSecondFactorStatus,
    setupSecondFactor,
    verifySecondFactor,
    resetSecondFactor
} from 'src/common/api/register';

import './Register.scss';

function SetupSecondFactor({ authToken, onSetup }) {
    const [secret, setSecret] = useState(null);

    const setup2fa = () => {
        if (secret === null) {
            setupSecondFactor(authToken).then(response => setSecret(response));
        }
    };

    if (secret) {
        return (
            <VerifySecondFactor
                secret={secret}
                authToken={authToken}
                onSetup={onSetup}
            />
        );
    }

    return (
        <div className="Register page setup">
            <h2>Register page</h2>
            <h3>
                It appears you don&apos;t have two factor authentication
                setup...
            </h3>
            <p>
                You can begin the process by pressing the button below.
                You&apos;ll need a smart phone with some kind of authenticator
                app. For example Authy or Google Authenticator.
            </p>
            <button className="setup2fa" onClick={setup2fa}>
                Setup 2fa
            </button>
        </div>
    );
}

function ViewSecret({ secret }) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        QRCode.toDataURL(secret.totp_url, {}, (err, url) => {
            if (err) {
                console.error(err);
                return;
            }

            setUrl(url);
        });
    }, [secret]);

    return (
        <div className="ViewSecret">
            <div className="imgWrapper">
                <img src={url} />
                <span className="text">Scan this qr code in your preferred app</span>
            </div>
            <p className="text">
                If you don&apos;t want to scan the qr code you can copy this
                secret:
            </p>
            <code>{secret.totp_secret}</code>
        </div>
    );
}

function VerifySecondFactor({ authToken, secret = null, onSetup }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const verify = e => {
        e.preventDefault();
        verifySecondFactor(authToken, code).then(response => {
            if (response.success) {
                onSetup();
            } else {
                setError(response.error);
            }
        });
    };

    const viewSecret = secret ? <ViewSecret secret={secret} /> : null;

    return (
        <div className="Register page verify">
            {viewSecret}
            <p className="text">
                You have setup 2fa but you haven&apos;t confirmed it yet. You
                need to enter the code to verify that your device is ready to
                go.
            </p>
            <form onSubmit={verify}>
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    name="code"
                    size="10"
                    placeholder="Enter your code"
                />
                <p className="error">{error}</p>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default function Register() {
    const authToken = useSelector(state => state.token);

    const [secondFactorStatus, setSecondFactorStatus] = useState(null);

    const [code, setCode] = useState('');
    const [status, setStatus] = useState({});

    const handleSubmit = evt => {
        evt.preventDefault();
        register(authToken, code).then(res => {
            if (res.error) {
                setStatus({ type: 'error', message: res.error });
            } else {
                setStatus({ type: 'success', message: res.message });
            }
        });
    };

    useEffect(() => {
        if (secondFactorStatus === null) {
            getSecondFactorStatus(authToken).then(setSecondFactorStatus);
        }
    }, [secondFactorStatus, authToken]);

    if (secondFactorStatus === null) {
        return (
            <div className="Register page">
                <h2>Register page</h2>
                <p>Loading...</p>
            </div>
        );
    } else if (secondFactorStatus === 'NOT_SETUP') {
        return (
            <SetupSecondFactor
                authToken={authToken}
                onSetup={() => setSecondFactorStatus('READY')}
            />
        );
        // TODO: remove / maybe in future add a method to cancel verfication and remove the secret
    } else if (secondFactorStatus === 'WAITING_VERIFICATION') {
        return (
            <VerifySecondFactor
                authToken={authToken}
                onSetup={() => setSecondFactorStatus('READY')}
            />
        );
    } else if (secondFactorStatus !== 'READY') {
        throw new Error('Invalid second factor status ' + secondFactorStatus);
    }

    return (
        <div className="Register page">
            <h2 onClick={() => resetSecondFactor(authToken)}>Register page</h2>
            <p className="text">
                Once you have submitted the code, the app will register that you
                have attended your currently timetabled event. The two-factor
                authentication code must match the one generated from your app.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    name="code"
                    size="10"
                    placeholder="Enter your code"
                />
                <input type="submit" value="Submit" />
            </form>

            <p className={status.type}>{status.message}</p>
        </div>
    );
}
