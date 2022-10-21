import React from "react";

type Props = {
    droppable: boolean;
    fileType?: string;
};

export const TypeIcon: React.FC<Props> = (props) => {
    if (props.droppable) {
        return <i className="fa fa-folder"></i>
    }

    switch (props.fileType) {
        case "image":
            return <i className="fa fa-file-image-o"></i>;
        case "csv":
            return <i className="fa fa-list"></i>
        case "text":
            return <i className="fa fa-sticky-note"></i>
        default:
            return null;
    }
};
