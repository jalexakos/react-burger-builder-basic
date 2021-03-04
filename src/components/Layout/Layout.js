import React, { useState} from 'react';
import Aux from '../../hoc/Auxiliary';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import classes from './Layout.module.css';
import { connect } from 'react-redux';

const Layout = props => {
    const [ sideDrawerIsVisible, setSideDrawerIsVisible ] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    };

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }

        return(
            <Aux>
                <Toolbar
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler} />
                <SideDrawer
                isAuth={props.isAuthenticated}
                open={sideDrawerIsVisible}
                closed={sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Aux>
        ) 
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);