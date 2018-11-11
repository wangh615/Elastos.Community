import React from 'react'
import StandardPage from '../StandardPage'
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import { Link } from 'react-router-dom'
import './style.scss'
import MediaQuery from 'react-responsive'
import { Col, Row, Card, Button, Breadcrumb, Icon, Table, Input, Modal, Avatar } from 'antd'
import {MAX_WIDTH_MOBILE} from "../../../config/constant"
import { USER_AVATAR_DEFAULT } from '@/constant'
import ProfilePopup from '@/module/profile/OverviewPopup/Container'

export default class extends StandardPage {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            showUserInfo: null,
            userListPagination: {
                pageSize: 5,
                current: 1
            }
        }
    }

    async componentDidMount() {
        this.refetch()
        this.debouncedRefetch = _.debounce(this.refetch.bind(this), 300)
    }

    componentWillUnmount() {
    }

    refetch() {
        const options = {
            search: this.state.search || '',
            results: (this.state.userListPagination || {}).pageSize || 5,
            page: (this.state.userListPagination || {}).current || 1
        }

        this.props.history.replace(`/developer?search=${options.search}&page=${options.page}`)
        this.props.listUsers(options)
    }

    ord_renderContent () {
        return (
            <div className="p_Developer">
                <div className="ebp-header-divider" />
                <div className="p_admin_index">
                    <div className="d_box">
                        <div className="p_admin_content">
                            {this.buildInfoPanel()}
                            {this.buildNavi()}
                            {this.buildMemberSearch()}
                        </div>
                    </div>
                </div>
                {this.renderProfileModal()}
                <Footer/>
            </div>
        )
    }

    renderProfileModal() {
        return (
            <Modal
                className="profile-overview-popup-modal"
                visible={!!this.state.showUserInfo}
                onCancel={this.handleCancelProfilePopup.bind(this)}
                footer={null}>
                { this.state.showUserInfo &&
                    <ProfilePopup showUserInfo={this.state.showUserInfo}/>
                }
            </Modal>
        )
    }

    handleCancelProfilePopup() {
        this.setState({
            showUserInfo: null
        })
    }

    buildInfoPanel() {
        return (
            <div className="info-panel panel">
                <div className="info-panel-content panel-content">
                    <div className="info-panel-left pull-left">
                        <h3 className="with-gizmo">
                            {I18N.get('0002')}
                        </h3>
                        <div className="info-panel-link">
                            <a href="https://t.me/elastosgroup" target="_blank">
                                Telegram
                            </a>
                        </div>
                        <div className="info-panel-link">
                            <a href="https://twitter.com/cyber__republic" target="_blank">
                                Twitter
                            </a>
                        </div>
                        <div className="info-panel-link">
                            <a href="https://github.com/cyber-republic" target="_blank">
                                GitHub
                            </a>
                        </div>
                        <div className="info-panel-link">
                            <a href="https://discord.gg/UG9j6kh" target="_blank">
                                Discord
                            </a>
                        </div>
                    </div>
                    <div className="pull-right">
                        <img src="/assets/images/community-world.svg"/>
                    </div>
                    <div className="clearfix"/>
                </div>
            </div>
        )
    }

    buildNavi() {
        const buildNaviItem = (title, description, link) => {
            return (
                <Row gutter={24} className="navi-panel-item"
                    onClick={() => this.props.history.push(link)}>
                    <Col md={4} xs={24} className="navi-panel-item-title">
                        {title}
                    </Col>
                    <Col md={16} xs={24} className="navi-panel-item-description">
                        {description}
                    </Col>
                    <Col md={4} xs={24} className="navi-panel-item-arrow">
                        <img src="/assets/images/arrow-right.png"/>
                    </Col>
                </Row>
            )
        }

        return (
            <div className="navi-panel panel">
                <div className="navi-panel-content panel-content">
                    {buildNaviItem(I18N.get('developer.learn'), I18N.get('developer.learn.description'), '/developer/learn')}
                    {buildNaviItem(I18N.get('developer.teams.title'), I18N.get('developer.teams.description'), '/developer/search')}
                    {buildNaviItem(I18N.get('developer.project.title'), I18N.get('developer.projects.description'), '/developer/search?type=PROJECT')}
                    {buildNaviItem(I18N.get('developer.tasks.title'), I18N.get('developer.tasks.description'), '/developer/search?type=TASK')}
                </div>
            </div>
        )
    }

    showUserProfile(user) {
        this.setState({
            showUserInfo: user
        })
    }

    getUserClickableLink(user, name) {
        return <a onClick={this.showUserProfile.bind(this, user)}>{name}</a>
    }

    getUserNameWithFallback(user) {
        const name = _.isEmpty(user.profile.firstName) && _.isEmpty(user.profile.lastName)
            ? user.username
            : _.trim([user.profile.firstName, user.profile.lastName].join(' '))
        return this.getUserClickableLink(user, name)
    }

    getUserCircles(user) {
        if (_.isEmpty(user.circles)) {
            return ''
        }

        return _.map(user.circles, (circle) =>
            <a key={circle._id} href={`/crcles-detail/${circle._id}`}>{circle.name} </a>
        )
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.state.userListPagination }
        pager.current = pagination.current
        this.setState({
            userListPagination: pager
        }, this.refetch.bind(this))
    }

    buildMemberSearch() {
        const columns = [
            {
                title: I18N.get('developer.member.table.column.member'),
                key: 'name',
                width: '33%',
                render: user => {
                    return (
                        <div>
                            <Avatar className={'gap-right ' + (user.role === 'LEADER' ? 'avatar-leader' : 'avatar-member')}
                                src={this.getAvatarWithFallback(user.profile.avatar)}/>
                            {this.getUserNameWithFallback(user)}
                        </div>
                    )
                }
            }, {
                title: I18N.get('developer.member.table.column.username'),
                dataIndex: 'username',
                width: '33%',
                render: (username, user) => this.getUserClickableLink(user, user.username)
            }, {
                title: I18N.get('developer.member.table.column.circles'),
                dataIndex: 'circles',
                width: '33%',
                render: (circles, user) => this.getUserCircles(user)
            }
        ]

        const searchChangedHandler = (e) => {
            const search = e.target.value
            this.setState({
                search,
                userListPagination: {
                    ...this.state.userListPagination,
                    current: 1
                }
            }, this.debouncedRefetch)
        }

        return (
            <div className="member-panel panel">
                <div className="member-panel-content panel-content">
                    <h3 className="with-gizmo">
                        {I18N.get('developer.member.search.title')}
                    </h3>
                    <Row className="member-panel-search">
                        <Col md={9} xs={24}>
                            <Input placeholder={I18N.get('developer.breadcrumb.search')}
                                onChange={searchChangedHandler.bind(this)}/>
                        </Col>
                    </Row>
                    <Table
                        className="no-borders"
                        dataSource={this.props.users}
                        loading={this.props.loading}
                        columns={columns}
                        bordered={false}
                        rowKey="_id"
                        pagination={{
                            ...this.state.userListPagination,
                            total: this.props.users_total,
                            showTotal: total => `Total ${total} users`
                        }}
                        onChange={this.handleTableChange.bind(this)}>
                    </Table>
                </div>
            </div>
        )
    }
}
