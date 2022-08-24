import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, TextField } from '@mui/material';


function SimpleDialog({ onClose, initialWord, open, item, handleChangeAssumption, onSave, clickedItemMainIndex, clickedItemIndex }) {

    const [setence, setSentence] = useState(item);
    const [wordsIndex, setWordsIndex] = useState([]);
    /* eslint-disable */
    const regex = new RegExp('\[$].*[$]\$', 'g');

    useEffect(() => {
        handleFindWord();
    }, [item]);

    const [inputWords, setInputWords] = useState([]);

    const handleFindWord = () => {
        const inputs = item?.match(/\$(.*?)\$/g);
        setInputWords(inputs);
    }

    const handleClose = () => {
        onClose();
        setSentence('')
    };

    const handleReplaceWord = () => {
        const assumptionStringToArray = item?.split(' ');
        let counter = 0
        assumptionStringToArray?.forEach((element, index) => {
            if (element.match(/\$(.*?)\$/g)) {
                assumptionStringToArray[index] = "$" + wordsIndex[counter] + "$";
                counter += 1;
            }
        });
        handleChangeAssumption(assumptionStringToArray.join(' '));
        setWordsIndex([]);
        onSave()
        onClose();
    }

    const handleChangeInput = (value, index) => {
        const newReplacedWordsArray = [...wordsIndex];
        newReplacedWordsArray[index] = value;
        setWordsIndex(newReplacedWordsArray);
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ borderBottom: '5px solid #1976d2', fontSize: '14px' }}>{item?.replace(/[$]/gi, "")}</DialogTitle>
            <div className='dialog-content' style={{ minWidth: '340px', width: '340px' }}>
                {inputWords?.map((element, index) => {
                    return <div className='dialog-input'>
                        <span className='dialog-word'>{initialWord[clickedItemMainIndex][clickedItemIndex][index]?.replaceAll('$', '')} = </span>
                        <TextField
                            onChange={(e) => handleChangeInput(e.target.value, index)}
                            value={wordsIndex?.[index] || ''}
                            sx={{ width: "100px" }}
                            variant='outlined'
                        />
                        <br />
                    </div>
                })}
                <p>{setence?.replace(/[$]/gi, "")}</p>
                <Button onClick={handleReplaceWord} disabled={wordsIndex?.[0] === ''} variant={'contained'}>Save</Button>
            </div>
        </Dialog >
    );
}
export default SimpleDialog;