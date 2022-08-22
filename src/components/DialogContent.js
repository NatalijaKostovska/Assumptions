import * as React from 'react';
import Dialog from '@mui/material/Dialog';


function DialogContent(props) {
    const { onClose, open, children } = props;

    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog onClose={handleClose} open={open} maxWidth="lg" >
            <div className='dialog'>
                {children}
            </div>
        </Dialog>
    );
}

export default DialogContent;