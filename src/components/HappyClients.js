import React from 'react';
import { Carousel, Container } from 'react-bootstrap';

const HappyClients = () => {
    const images = [
        '/img/car1.png',
        '/img/car2.png',
        '/img/car3.png',
        '/img/car4.png',
        '/img/car5.png',
        '/img/car6.png',
        '/img/car7.png',
        '/img/car8.png',
    ];

    const groupedImages = [];
    const groupSize = 3;
    for (let i = 0; i < images.length; i += groupSize) {
        const group = images.slice(i, i + groupSize);
        while (group.length < groupSize) {
            group.push(images[group.length % images.length]);
        }
        groupedImages.push(group);
    }

    return (
        <section
            style={{
                background: 'linear-gradient(135deg, #e6f0ff 0%, #c6d7ff 100%)',
                padding: '80px 0',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <Container className="text-center">
                <h2
                    style={{
                        fontWeight: '800',
                        fontSize: '2.8rem',
                        marginBottom: '0.5rem',
                        color: '#34495e',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        textShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    Our Happy Clients
                </h2>
                <div
                    style={{
                        height: '5px',
                        width: '100px',
                        backgroundColor: '#5b7fff',
                        margin: '0 auto 40px auto',
                        borderRadius: '3px',
                        boxShadow: '0 3px 12px #8aa1ff',
                    }}
                />
                <p
                    style={{
                        color: '#556677',
                        fontSize: '1.25rem',
                        maxWidth: '650px',
                        margin: '0 auto 50px auto',
                        fontWeight: '600',
                        lineHeight: 1.6,
                    }}
                >
                    Trusted by amazing teachers and guardians who believe in our commitment and quality.
                </p>

                <Carousel
                    indicators={true}
                    controls={true}
                    interval={4000}
                    pause="hover"
                    slide={true}
                    wrap={true}
                    style={{ maxWidth: '980px', margin: 'auto' }}
                >
                    {groupedImages.map((group, index) => (
                        <Carousel.Item key={index}>
                            <div className="row justify-content-center gx-5">
                                {group.map((src, i) => (
                                    <div
                                        className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
                                        key={i}
                                    >
                                        <div
                                            style={{
                                                height: '190px',
                                                maxWidth: '280px',
                                                width: '100%',
                                                backgroundColor: '#ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '18px',
                                                boxShadow:
                                                    '0 8px 20px rgba(91, 127, 255, 0.15)',
                                                overflow: 'hidden',
                                                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                                                cursor: 'pointer',
                                                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.05))',
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.transform = 'scale(1.08)';
                                                e.currentTarget.style.boxShadow =
                                                    '0 15px 35px rgba(91, 127, 255, 0.4)';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow =
                                                    '0 8px 20px rgba(91, 127, 255, 0.15)';
                                            }}
                                        >
                                            <img
                                                src={src}
                                                alt={`Client ${index * groupSize + i + 1}`}
                                                style={{
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    objectFit: 'contain',
                                                    userSelect: 'none',
                                                }}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default HappyClients;
