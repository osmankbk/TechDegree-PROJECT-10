import React, { Component } from 'react';

//This component displays when an authorized user is trying to update a course that's theirs.
class UpdateCourse extends Component {
  _isMounted = false;

  state = {
    autheUser: this.props.context.authenticatedUser,
    userId: this.props.context.authenticatedUser.id,
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    courses: [],
    courseId: '',
    courseUser: '',
    errors: []
  }
  componentDidMount() {
    this._isMounted = true;

//This function makes a get request on mount & shows the result only if the user owns the course
    const { context } = this.props;
    let courseId = this.props.match.params.id;
    const authUser = this.props.context.authenticatedUser;
      context.data.getCourse(courseId)
      .then(response => {  
          if (response !== 'course not available') {
            this.setState({
              courses: response,
              courseId: response.id,
              courseUser: response.User,
              title: response.title,
              description: response.description,
              estimatedTime: response.estimatedTime,
              materialsNeeded: response.materialsNeeded,
            })
            if(!authUser || this.state.courseUser.id !== authUser.id) {
              this.props.history.push('/forbidden');
            }
          } else {
            this.props.history.push('/notFound');
          }
      }).catch(errors => {
        console.log(errors);
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  };

    render() {

      const {
        errors,
        title,
    description,
    estimatedTime,
    materialsNeeded
         } = this.state;
      

        return (
            <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          <form>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                {<ul>
                  {errors.map((error, i) => 
                    <li key={i}>{error}</li>
                  )}
                </ul>}
                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    onChange={this.change} value={title}></input></div>
                <p>{`By ${this.state.courseUser.firstName} ${this.state.courseUser.lastName}`}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.change} value={description}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" onChange={this.change} value={estimatedTime}></input></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.change} value={materialsNeeded}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
          </form>
          <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick={this.submit}>Update Course</button><button className="button button-secondary" onClick={this.cancle}>Cancel</button></div>
        </div>
      </div>
        );
    }
    //This func runs the update function while preventing the forms default nature  
    submit = (event) => {
      event.preventDefault();
      this.updateACourse();
    }

 //This function runs on change event enabling the inputs value to that of the change events value   
    change = (event) => {
      const name = event.target.name;
      const value = event.target.value
 
      this.setState( () => {
        return {
           [name]: value,
        }
      })
    }
//This func makes PUT request to the server
    updateACourse = (event) => {
      const { context } = this.props;
      const emailAddress = this.state.autheUser.emailAddress;
      const password = this.props.context.authPassword;
      const courseUserId = this.state.courseUser.id;
      const { userId } = this.state;
      const {
        courseId,
        title,
        description,
        estimatedTime,
        materialsNeeded
         } = this.state;

         const course = {
           courseId,
           title,
           description,
           estimatedTime,
           materialsNeeded,
           courseUserId
         }
      if(courseUserId === userId) {
        context.data.updateCourse(courseId, course, emailAddress, password)
        .then(response => {
          if(!response) {
            let courseId = this.props.match.params.id;
            this.props.history.push(`/courses/${courseId}`);            
          }else if(response && response !== 'course not available') {
            this.setState({
              errors: response,
            })
            console.log(response);
          }
          else if(response && response === 'course not available'){
            this.props.history.push('/notFound');
            console.log(response);
          } else {
            this.props.history.push('/error');
          }
        }).catch(errors => {
          console.log(errors);
        })
      } else {
        this.props.history.push('/forbidden');
      }
    }

//This cancels the update process    
    cancle = () =>{
      this.props.history.goBack(); 
    }
}

export default UpdateCourse;