import React, { useCallback, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { RulesContainer } from './rules/RulesContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import { DayByDayContainer } from './daybyday/DayByDayContainer';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';


export const PlanContainer = () => {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const onRefresh = useCallback(() => {
        setCurrentTime(Date.now());
    }, [])

    const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Container className="justify-content-middle">
            You need to be logged in! <Button onClick={() => loginWithRedirect()}>Login</Button>
        </Container>
    }

    const userid = user.sub;

    return <Container>
        <Row>
            <DayByDayContainer userid={userid} currentTime={currentTime} />
        </Row>
        <hr />
        <Row>
            <Col>
                <RulesContainer userid={userid} onRefresh={onRefresh} />
            </Col>
            <Col>
                <h2>Transactions</h2>
                <TransactionsContainer userid={userid} currentTime={currentTime} />
            </Col>
        </Row>
    </Container>
}