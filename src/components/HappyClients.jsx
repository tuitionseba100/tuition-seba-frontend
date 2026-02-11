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
                background: '#ffffff',
                padding: '50px 0',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Container className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                <h2
                    style={{
                        fontWeight: '800',
                        fontSize: '2.5rem',
                        marginBottom: '0.6rem',
                        color: '#004085',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    Our Happy Clients
                </h2>
                <div
                    style={{
                        height: '4px',
                        width: '60px',
                        backgroundColor: '#61dafb',
                        margin: '0 auto 30px auto',
                        borderRadius: '2px',
                        boxShadow: '0 2px 8px rgba(97, 218, 251, 0.4)',
                    }}
                />
                <p
                    style={{
                        color: '#556677',
                        fontSize: '1.1rem',
                        maxWidth: '700px',
                        margin: '0 auto 40px auto',
                        fontWeight: '500',
                        lineHeight: 1.6,
                    }}
                >
                    Trusted by amazing teachers and guardians who believe in our commitment and quality education support.
                </p>

                <Carousel
                    indicators={true}
                    controls={true}
                    interval={2000} // Speed up auto-slide to 2 seconds
                    pause="hover"
                    slide={true}
                    wrap={true}
                    className="custom-carousel"
                    style={{ maxWidth: '1200px', margin: 'auto' }}
                >
                    {groupedImages.map((group, index) => (
                        <Carousel.Item key={index}>
                            <div className="row justify-content-center gx-4 gy-4">
                                {group.map((src, i) => (
                                    <div
                                        className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
                                        key={i}
                                    >
                                        <div
                                            style={{
                                                height: '200px',
                                                maxWidth: '350px',
                                                width: '100%',
                                                background: '#f8f9fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(0, 64, 133, 0.1)',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s ease',
                                                cursor: 'pointer',
                                                padding: '15px'
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.transform = 'translateY(-10px)';
                                                e.currentTarget.style.borderColor = 'rgba(97, 218, 251, 0.5)';
                                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 64, 133, 0.15)';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = 'rgba(0, 64, 133, 0.1)';
                                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)';
                                            }}
                                        >
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#ffffff',
                                                borderRadius: '12px',
                                                padding: '5px'
                                            }}>
                                                <img
                                                    src={src}
                                                    alt={`Client ${index * groupSize + i + 1}`}
                                                    style={{
                                                        maxHeight: '100%',
                                                        width: '100%',
                                                        objectFit: 'contain',
                                                        userSelect: 'none',
                                                    }}
                                                    draggable={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>

            <style>
                {`
                .custom-carousel .carousel-indicators [data-bs-target] {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: rgba(0, 64, 133, 0.2);
                    margin: 0 5px;
                    border: none;
                    transition: all 0.3s ease;
                }
                .custom-carousel .carousel-indicators .active {
                    background-color: #61dafb;
                    transform: scale(1.2);
                    box-shadow: 0 0 8px rgba(97, 218, 251, 0.4);
                }
                .custom-carousel .carousel-control-prev,
                .custom-carousel .carousel-control-next {
                    width: 45px;
                    height: 45px;
                    background: rgba(0, 64, 133, 0.05);
                    border-radius: 50%;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(0, 64, 133, 0.1);
                }
                .custom-carousel:hover .carousel-control-prev,
                .custom-carousel:hover .carousel-control-next {
                    opacity: 1;
                }
                .custom-carousel .carousel-control-prev:hover,
                .custom-carousel .carousel-control-next:hover {
                    background: rgba(0, 64, 133, 0.1);
                    border-color: #61dafb;
                    color: #004085;
                }
                .custom-carousel .carousel-control-prev-icon,
                .custom-carousel .carousel-control-next-icon {
                    filter: invert(21%) sepia(85%) saturate(1478%) hue-rotate(195deg) brightness(91%) contrast(104%); /* Makes it brand blue */
                }
                .custom-carousel .carousel-control-prev { left: -60px; }
                .custom-carousel .carousel-control-next { right: -60px; }

                @media (max-width: 1200px) {
                    .custom-carousel .carousel-control-prev { left: -10px; }
                    .custom-carousel .carousel-control-next { right: -10px; }
                }
                `}
            </style>
        </section>
    );
};

export default HappyClients;
