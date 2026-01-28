import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  h3 {
    margin: 0 0 20px;
    font-size: 18px;
    color: #2d3748;
    font-weight: 600;
  }
`;

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#ecc94b', '#f56565', '#667eea'];

const AttendanceCharts = ({ dailyData, pieData }) => {
    return (
        <ChartsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <ChartCard>
                <h3>Daily Attendance (Last 14 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="present" name="Present" fill="#4299e1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
                <h3>Top Employees Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="count"
                            paddingAngle={5}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </ChartsContainer>
    );
};

export default AttendanceCharts;
