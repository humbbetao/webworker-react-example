
import React, { Component } from 'react';
import { fetchUsers, sortListDescending } from './SortService';
import worker from './sort.worker';
import WebWorker from './WebWorker';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            users: [],
            isSorting: false,
        };

        this.renderUsers = this.renderUsers.bind(this);
        this.sortAscending = this.sortAscending.bind(this);
        this.sortDescending = this.sortDescending.bind(this);
    }

    componentDidMount = () => {
        this.worker = new WebWorker(worker); // Create the worker
        fetchUsers().then(users => {
            this.setState({
                users,
                isLoading: false
            });
        })
        // get the users
    }

    sortAscending = () => {
        this.worker.postMessage(this.state.users); // send users to worker in order to sort

        this.setState(prevState => ({
            ...prevState,
            isSorting: true
        }), () => {
            this.worker.addEventListener('message', (event) => {
            // add an event listenet to worker with type message
            // when the worker is resolved, send a event with data ...
            // the data is the users sorted
                const sortedList = event.data;
                this.setState({
                    users: sortedList,
                    isSorting: false
                })
            });
        });

        return;
    }

    sortDescending = () => {
        this.setState(prevState => ({
            ...prevState,
            isSorting: true
        }), () => {
            const sortedList = sortListDescending(this.state.users)
            this.setState({
                users: sortedList,
                isSorting: false
            });
        });
    }

    renderUsers() {
        return this.state.users.slice(0,20).map((user, index) => {
            return (
                <div key={index} className="card">
                    <div className="card-header">
                        {user.name}
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">
                            {user.email}
                        </h5>
                        <p className="card-text">
                            {user.joinedOn.toString()}
                        </p>

                    </div>
                    <div className="card-footer text-muted">
                        {user.commentCount} comments
                    </div>
                </div>
            );
        });
    }

    render() {
        const usersWrapperClasses = `row marginTop ${this.state.isSorting ? 'sorting' : ''}`;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="btn-group mr-2 mt-2" role="group" aria-label="Basic example">
                            <button
                                onClick={this.sortAscending}
                                type="button"
                                disabled={this.state.isLoading}
                                className="btn btn-primary">
                                Sort Ascending Number of Comments <strong>with WebWorker</strong>
                            </button>
                        </div>

                        <div className="btn-group mr-2 mt-2" role="group" aria-label="Basic example">
                            <button
                                onClick={this.sortDescending}
                                type="button"
                                disabled={this.state.isLoading}
                                className="btn btn-success">
                                Sort Descending Number of Comments <strong>WITHOUT WebWorker</strong>
                            </button>
                        </div>

                        <div className="btn-group mt-2" role="group" aria-label="Basic example">
                            <button
                                onClick={() => console.log('clicked')}
                                type="button"
                                disabled={this.state.isLoading}
                                className="btn btn-info">
                                Some button
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="bouncy-ball"></div>
                    </div>
                </div>

                {this.state.isLoading &&
                    <div className="marginTop">
                        Loading ...
                    </div>
                }

                {!this.state.isLoading &&
                    <div className={usersWrapperClasses}>
                        <div className="col-md-12">
                            {this.renderUsers()}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;