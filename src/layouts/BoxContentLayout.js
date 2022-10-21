import React from 'react'

function BoxContentLayout(props) {
    return (

        <div className="box-circle col-md-7">
            <div className="col-md-12">


                <div className="BoxContentLayout">
                    {props.img}
                    <p className="p-5">
                        {props.content}
                    </p>
                    <button
                        onClick={props.onclick}
                        className="btn btn-outline-primary btn-lg btn-identfy mt-2"
                    >
                        {props['label-btn']}
                    </button>
                </div>

            </div>
        </div>
    )
}
export default BoxContentLayout
