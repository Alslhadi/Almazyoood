const CORRECT_PASSCODE = '554433';

/**
 * Checks if the provided passcode is correct.
 * @param passcode The passcode string to verify.
 * @returns `true` if the passcode is correct, `false` otherwise.
 */
export const verifyPasscode = (passcode: string | null): boolean => {
    if (!passcode) {
        return false;
    }
    return passcode.trim() === CORRECT_PASSCODE;
};
