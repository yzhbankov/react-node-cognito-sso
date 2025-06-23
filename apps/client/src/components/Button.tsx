import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import {SpinningCircle} from '@/components/SpinningCircle';

type ButtonProps = {
    className?: any;
    disabled: boolean;
    inProgress: boolean;
    label: string;
    type?: 'submit' | 'reset' | 'button' | undefined;
    onClick?: () => void;
};

export function Button({ className, disabled, inProgress, label, type, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                className,
                'relative',
                'border border-gray-400',
                'font-medium',
                'py-2 px-4 ms-3 mt-3',
                'rounded-lg w-30',
                disabled
                    ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                    : 'cursor-pointer bg-gray-100/20 hover:bg-gray-100 text-gray-600'
            )}
            type={type}
        >
            <span className="relative flex justify-center items-center">
                <span>{label}</span>
                {inProgress && (
                    <span className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <SpinningCircle size={7} color="gray" />
                    </span>
                )}
            </span>
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    inProgress: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    className: '',
    disabled: false,
    inProgress: false,
    label: '',
    onClick: () => {},
};
