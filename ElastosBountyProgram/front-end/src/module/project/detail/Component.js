import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import moment from 'moment'

import {Col, Row, Tag, Icon, Carousel, Avatar, Button, Spin } from 'antd'

import './style.scss'

export default class extends BaseComponent {

    ord_states() {
        return {
        }
    }

    componentDidMount() {
        const taskId = this.props.taskId
        taskId && this.props.getTaskDetail(taskId)
    }

    componentWillUnmount() {
        this.props.resetTaskDetail()
    }

    renderUpperLeftBox() {
        const details = this.props.detail;

        let carouselImages = []
        for (let i of details.pictures) {
            carouselImages.push(<img src={i.url} key={i}/>)
        }

        return (
            <div className="col-left-div">
                <div>
                    <Carousel>
                        {carouselImages}
                    </Carousel>
                </div>
                <hr className="divider"/>
                <div>
                    <Tag>Javascript</Tag>
                    <Tag>IoT</Tag>
                    <Tag>C++</Tag>
                    <Tag>Finance</Tag>
                </div>
            </div>
        )
    }

    ord_render () {
        const details = this.props.detail;
        if(_.isEmpty(this.props.detail)) {
            return <Spin />
        }
        console.log(details);
        return (
            <div className="c_Project">
                <Row className="top-section">
                    <Col xs={24} sm={24} md={8} className="col-left">
                        {this.renderUpperLeftBox()}
                    </Col>

                    <Col xs={24} sm={24} md={16} className="col-right">
                        <div className="title">
                            <span>iOS Wallet App</span>
                            <Icon className="badge" type="home"/>
                        </div>
                        <div className="leader">
                            <Avatar size="64" style={{ backgroundColor: '#87d068' }} icon="user" />
                            <div>Leader: Jim Bean</div>
                        </div>
                        <div className="content">
                            <div className="entry">Deadline: 30 August 2018</div>
                            <div className="entry">Progress. 70%</div>
                            <div className="entry">Team Size: 35</div>
                            <div className="reward">430 ELA</div>
                        </div>
                        <hr className="divider"/>
                        <div className="description-title">Description</div>
                        <hr className="divider"/>
                        <div className="description-content">We are making the best damn thing in the world</div>
                    </Col>
                </Row>
                <Row className="actions">
                    <span className="callToActionText">Currently Hiring!</span>
                    <Button className="colored-bottom">Join Project</Button>
                    <Button className="normal-bottom">Message</Button>
                    <Button className="normal-bottom">Submit Bug</Button>
                </Row>
                <Row className="contributors">
                    <div>Current Contributors</div>

                </Row>
                <Row className="applications">
                    <div>Pending Applications</div>
                </Row>
            </div>
        )
    }
}
