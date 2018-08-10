import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import moment from 'moment'
import {message, Col, Row, Tag, Icon, Carousel, Avatar, Button, Spin, Select, Table, Input, Form, Divider} from 'antd'
import _ from 'lodash'
import './style.scss'
import Comments from '@/module/common/comments/Container'
import { TEAM_USER_STATUS } from '@/constant'

const { Column } = Table;

class C extends BaseComponent {
    ord_states() {
        return {
        }
    }

    componentDidMount() {
        const teamId = this.props.teamId
        this.props.getTeamDetail(teamId)
    }

    componentWillUnmount() {
        this.props.resetTeamDetail()
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/admin/profile/${userId}`)
    }

    approveUser(teamCandidateId) {
        this.props.acceptCandidate(teamCandidateId)
    }

    rejectUser(teamCandidateId) {
        this.props.rejectCandidate(teamCandidateId)
    }

    withdrawUser(teamCandidateId) {
        this.props.withdrawCandidate(teamCandidateId)
    }

    renderUpperLeftBox() {
        const details = this.props.detail;

        let carouselImages = []
        for (let i of details.pictures) {
            carouselImages.push(<img src={i.url} key={i}/>)
        }

        let domains = []
        for (let i of details.domain) {
            domains.push(<Tag key={i}>{i}</Tag>)
        }

        return (
            <div className="left-container">
                <div className="pictures-container">
                    <Carousel autoplay>
                        {carouselImages}
                    </Carousel>
                </div>
                <div className="domains-container">
                    {domains}
                </div>
            </div>
        )
    }

    renderUpperRightBox() {
        const detail = this.props.detail
        const name = detail.name || ''
        const leaderName = detail.owner.profile
            ? (detail.owner.profile.firstName + ' ' + detail.owner.profile.lastName)
            : ''
        const teamSize = /* detail.candidateCompleted.length || */ ''
        const description = detail.profile.description || ''
        const leaderImage = detail.owner.profile.avatar || ''

        return (
            <div>
                <div className="title">
                    <span>{name}</span>
                </div>
                <div className="leader">
                    <Avatar size="large" src={leaderImage} />
                    <div className="ellipsis">{leaderName}</div>
                </div>
                <div className="content">
                    <div className="entry">Team Size: {teamSize}</div>
                </div>
                <div class="description-box">
                    <hr className="divider"/>
                    <div className="description-title">Description</div>
                    <hr className="divider"/>
                    <div className="description-content">{description}</div>
                </div>
            </div>
        )
    }

    renderCurrentContributors() {
        const detail = this.props.detail
        const pendingMembers = _.filter(detail.members, { status: TEAM_USER_STATUS.NORMAL })
        const columns = [{
            title: 'Name',
            key: 'name',
            render: candidate => {
                return (
                    <div key={candidate._id}>
                        <Avatar src={candidate.user.profile.avatar} />
                        <a className="row-name-link" onClick={this.linkProfileInfo.bind(this, candidate.user._id)}>
                            {`${candidate.user.profile.firstName} ${candidate.user.profile.lastName}`}</a>
                    </div>)
            }
        }, {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: role => {
                return (
                    <div class="text-right">
                        {role}
                    </div>
                )
            }
        }]

        return (
            <Table
                className="no-borders headerless"
                dataSource={pendingMembers}
                columns={columns}
                bordered={false}
                rowKey="_id"
                pagination={false}>
            </Table>
        )
    }

    renderCurrentApplicants() {
        const detail = this.props.detail
        const pendingMembers = _.filter(detail.members, { status: TEAM_USER_STATUS.PENDING })
        const isTeamOwner = this.isTeamOwner()
        const canWithdraw = (teamCandidateId) => {
            const candidate = _.find(pendingMembers, { _id: teamCandidateId })
            return candidate.user._id === this.props.currentUserId
        }

        const actionRenderer = (candidate) => {
            if (isTeamOwner) {
                return (
                    <div className="text-right">
                        <a onClick={this.approveUser.bind(this, candidate._id)}>Approve</a>
                        <Divider type="vertical"/>
                        <a onClick={this.rejectUser.bind(this, candidate._id)}>Disapprove</a>
                    </div>
                )
            } else if (canWithdraw(candidate._id)) {
                return (
                    <div className="text-right">
                        <a onClick={this.withdrawUser.bind(this, candidate._id)}>Withdraw</a>
                    </div>
                )
            } else {
                return null
            }
        }

        const columns = [{
            title: 'Name',
            key: 'name',
            render: candidate => {
                return (
                    <div key={candidate._id}>
                        <Avatar src={candidate.user.profile.avatar} />
                        <a className="row-name-link" onClick={this.linkProfileInfo.bind(this, candidate.user._id)}>
                            {`${candidate.user.profile.firstName} ${candidate.user.profile.lastName}`}</a>
                    </div>)
            }
        }, {
            title: 'Action',
            key: 'action',
            render: actionRenderer
        }]

        return (
            <Table
                loading={this.props.loading}
                className="no-borders headerless"
                dataSource={pendingMembers}
                columns={columns}
                bordered={false}
                rowKey="_id"
                pagination={false}>
            </Table>
        )
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.applyToTeam(this.props.teamId, this.props.currentUserId, values.applyMsg)
                    .then(() => {
                        this.setState({ applying: false })
                        message.success('Application sent. Thank you!')
                    })
            }
        })
    }

    getApplicationForm() {
        const {getFieldDecorator} = this.props.form
        const applyMsg_fn = getFieldDecorator('applyMsg', {
            rules: [{required: true, message: 'Application is required'}],
            initialValue: ''
        })
        const applyMsg_el = (
            <Input.TextArea rows={8} className="team-application" disabled={this.props.loading}
                placeholder="Tell us why you want to join."/>
        )
        const applyMsgPanel = applyMsg_fn(applyMsg_el)

        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="application-form">
                <Form.Item className="no-margin">
                    {applyMsgPanel}
                </Form.Item>
                <Button loading={this.props.loading} className="d_btn pull-left" onClick={() => this.setState({ applying: false })}>
                    Cancel
                </Button>
                <Button loading={this.props.loading} className="d_btn pull-right" type="primary" htmlType="submit">
                    Apply
                </Button>
                <div class="clearfix"/>
            </Form>
        )
    }

    isTeamOwner() {
        return this.props.detail.owner && (this.props.detail.owner._id === this.props.currentUserId)
    }

    ord_render () {
        const loading = _.isEmpty(this.props.detail)
        const isTeamOwner = this.isTeamOwner()

        return (
            <div className="c_Project">
                { loading
                    ? (
                        <div className="full-width full-height valign-wrapper halign-wrapper">
                            <Spin className="loading-spinner" />
                        </div>
                    )
                    : (
                        <div>
                            <Row className="top-section">
                                <Col xs={24} sm={24} md={8} className="col-left">
                                    {this.renderUpperLeftBox()}
                                </Col>

                                <Col xs={24} sm={24} md={16} className="col-right">
                                    {this.renderUpperRightBox()}
                                </Col>
                            </Row>

                            {this.props.page !== 'LEADER' && !isTeamOwner &&
                                <Row className="actions">
                                    <Button type="primary" onClick={() => this.setState({ applying: true })}>
                                        Join Team
                                    </Button>
                                    <Button>
                                        Message
                                    </Button>
                                </Row>
                            }

                            {this.state.applying && this.getApplicationForm()}

                            {!this.state.applying &&
                                <Row className="contributors">
                                    <h3 className="no-margin">Current Members</h3>
                                    {this.renderCurrentContributors()}
                                </Row>
                            }

                            {!this.state.applying &&
                                <Row className="applications">
                                    <h3 className="no-margin">Pending Applications</h3>
                                    {this.renderCurrentApplicants()}
                                </Row>
                            }

                            {false && this.props.page === 'LEADER' &&
                                <Row>
                                    <Comments type="team" canPost={true} canSubscribe={!isTeamOwner} model={this.props.teamId}/>
                                </Row>
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Form.create()(C)
