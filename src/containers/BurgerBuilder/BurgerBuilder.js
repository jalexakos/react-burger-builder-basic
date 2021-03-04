import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

export const BurgerBuilder = props => {
    
    const [purchasing, setPurchasing] = useState(false);
    // state = {
    //     purchaseable: false,
    //     purchasing: false,
    // }

    const dispatch =  useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    })

    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice
    })

    const error = useSelector(state => {
        return state.burgerBuilder.error
    })

    const isAuthenticated = useSelector(state => {
        return state.auth.token
    })

    const onIngredientAdded = (ingredientName) => dispatch(actions.addIngredient(ingredientName));
    const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngredient(ingredientName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));
    
    useEffect(() => {
        onInitIngredients();
     }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey =>{
            return ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum + el;
        }, 0);

        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated){
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout')
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

        const disableInfo = {
            ...ings
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        if (ings) {    
            burger = (<Aux>
            <Burger ingredients={ings} />
                <BuildControls
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                disabled={disableInfo}
                price={price}
                purchaseable = {updatePurchaseState(ings)}
                ordered={purchaseHandler}
                isAuth={isAuthenticated} />
            </Aux>);
            orderSummary = <OrderSummary 
                ingredients={ings}
                purchaseCanceled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                totalPrice={price}
            />
            }
        return(
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
}

export default withErrorHandler(BurgerBuilder, axios);