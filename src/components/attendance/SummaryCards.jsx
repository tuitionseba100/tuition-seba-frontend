import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUserClock, FaCalendarCheck, FaClock, FaChartLine } from 'react-icons/fa';

const SummaryContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => props.bg || '#f0f0f0'};
  color: ${props => props.color || '#333'};
`;

const Content = styled.div`
  text-align: right;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const SummaryCards = ({ summary }) => {
    if (!summary) return null;

    return (
        <SummaryContainer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card variants={itemVariants}>
                <IconWrapper bg="rgba(66, 153, 225, 0.2)" color="#4299e1">
                    <FaUserClock />
                </IconWrapper>
                <Content>
                    <Title>{summary.totalRecords}</Title>
                    <Subtitle>Total Present Today</Subtitle>
                </Content>
            </Card>

            <Card variants={itemVariants}>
                <IconWrapper bg="rgba(72, 187, 120, 0.2)" color="#48bb78">
                    <FaCalendarCheck />
                </IconWrapper>
                <Content>
                    <Title>{summary.completedRecords}</Title>
                    <Subtitle>Completed</Subtitle>
                </Content>
            </Card>

            <Card variants={itemVariants}>
                <IconWrapper bg="rgba(236, 201, 75, 0.2)" color="#d69e2e">
                    <FaClock />
                </IconWrapper>
                <Content>
                    <Title>{summary.runningRecords}</Title>
                    <Subtitle>In Progress</Subtitle>
                </Content>
            </Card>

            <Card variants={itemVariants}>
                <IconWrapper bg="rgba(159, 122, 234, 0.2)" color="#9f7aea">
                    <FaChartLine />
                </IconWrapper>
                <Content>
                    <Title>{summary.avgHours}h</Title>
                    <Subtitle>Avg Duration</Subtitle>
                </Content>
            </Card>
        </SummaryContainer>
    );
};

export default SummaryCards;
