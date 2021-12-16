import React from 'react'

const BirthdayCard = (props) => {
    return (
        <div className='container my-3'>
            <div className="col-md-6 " style={{ margin: "auto" }}>
            <div className="card text-dark bg-info mb-3">
               
                <div className="card-body">
                    
                    <p className="card-text"><b>{props.person}</b> </p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default BirthdayCard
