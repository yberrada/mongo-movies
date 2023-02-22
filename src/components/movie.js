import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Movie = ({ title, year, rating, fullplot, poster, match }) => {

    return (
        <div >
            <Card className={match} border="dark" bg="dark" text="white" style={{ width: '21rem' }}>
                <Card.Header>{title}</Card.Header>
                <Card.Img className="poster" variant="top" src={poster} />
                <Card.Body>
                    <Card.Title>Release year: {year}</Card.Title>
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