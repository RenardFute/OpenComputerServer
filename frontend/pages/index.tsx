import { makeStyles } from '@material-ui/core';
import React from "react";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

declare var window: MyWindow;

interface MyWindow extends Window {
    execLua<T>(index: number, code: string, ...args: any[]): Promise<T>;
    execBash<T>(index: number, code: string, ...args: any[]): Promise<T>;
}

const IndexPage = () => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.root}>
                <p>Hello World!</p>
                <ButtonGroup>
                    <Button onClick={() => console.log('Hello World!')}>Hello</Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default IndexPage;