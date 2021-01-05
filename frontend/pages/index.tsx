import { makeStyles } from '@material-ui/core';
import React from "react";

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
    refreshData(): void;
}

const IndexPage = () => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.root}>
                <p>Hello World!</p>
            </div>
        </div>
    );
};

export default IndexPage;