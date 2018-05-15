# react-legit

That simple form validation you were waiting for :)

# Simple Example

```jsx
import React from "react"
import { Validate, ValidationGroup } from "./"

const ApplicantSection = ({ name, email, onChange, valid }) => (
    <div>
        <div>{`Is this section valid? ${valid}`}</div>
        <div className="group">
            <label>Name:</label>
            <Validate>
                <input name="name" value={name} onChange={onChange} required />
            </Validate>
        </div>
        <div className="group">
            <label>Email:</label>
            <Validate>
                <input type="email" name="email" value={email} onChange={onChange} required />
            </Validate>
        </div>
    </div>
)

const IncomeSourceSection = ({ source, income, onChange, valid }) => (
    <div>
        <div>{`Is this section valid? ${valid}`}</div>
        <div className="group">
            <label>Source:</label>
            <Validate>
                <input name="source" value={source} onChange={onChange} required />
            </Validate>
        </div>
        <div className="group">
            <label>Income:</label>
            <Validate>
                <input type="number" name="income" value={income} onChange={onChange} required />
            </Validate>
        </div>
    </div>
)

const FormValidationState = ({ valid }) => (
    <div>{`Is the entire form valid? ${valid}`}</div>
)

export const RequiredInput = () => {
    class Example extends React.Component {
        state = {}

        handleChange = (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        render() {
            return (
                <ValidationGroup propagate>
                    <FormValidationState />

                    <ValidationGroup propagate>
                        <ApplicantSection name={this.state.name} email={this.state.email} onChange={this.handleChange} />
                    </ValidationGroup>

                    <ValidationGroup propagate>
                        <IncomeSourceSection source={this.state.source} income={this.state.income} onChange={this.handleChange} />
                    </ValidationGroup>
               </ValidationGroup> 
            )
        }
    }

    return <Example />
}
```