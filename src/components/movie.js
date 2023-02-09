import React, { useEffect, useRef, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Movie = ({ title, year, rating, fullplot, poster, match }) => {
    const navigate = useNavigate();

    return (
        <div >
            <Card className={match} border="dark" bg="dark" text="white" style={{ width: '21rem' }}>
                <Card.Header>{title}</Card.Header>
                <Card.Img className="poster" variant="top" src={poster} />
                <Card.Body>
                    <Card.Title>{year}</Card.Title>
                    <Card.Text className="scroll">
                        {fullplot}
                    </Card.Text>
                    <Button variant="primary">{rating}</Button>
                </Card.Body>
                <Card.Footer>
                    {/* <small className="text">{year}</small> */}

                    {/* <small className="text-muted">{rating}</small> */}
                </Card.Footer>
            </Card>
        </div>
    )
};

export default Movie;