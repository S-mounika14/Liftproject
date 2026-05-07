import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#0C7A54',
    secondary: '#1270B8',
    white: '#fff',
    background: '#fff',
    inputBg: '#F5FAF7',
    inputBorder: '#D4EBE2',
    labelColor: '#7A9490',
    textDark: '#1A2E25',
    stepDone: '#22C98A',
    stepInactive: '#D4EBE2',
    errorRed: 'red',
};

export const commonStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 14,
        paddingHorizontal: 16,
    },

    backBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        flex: 1,
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
    },

    stepsRow: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        paddingVertical: 12,
    },

    step: {
        width: 20,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.stepInactive,
    },

    stepActive: {
        width: 30,
        backgroundColor: colors.primary,
    },

    stepDone: {
        width: 22,
        backgroundColor: colors.stepDone,
    },

    body: {
        paddingHorizontal: 20,
    },

    label: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.labelColor,
        marginBottom: 5,
        marginTop: 14,
    },

    input: {
        backgroundColor: colors.inputBg,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 10,
        padding: 11,
        fontSize: 13,
        color: colors.textDark,
    },

    inputDisabled: {
        backgroundColor: '#F0F0F0',
        opacity: 0.6,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    inputFlex: {
        flex: 1,
    },

    verifyBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderRadius: 10,
    },

    verifyBtnDisabled: {
        backgroundColor: '#B0CFC4',
    },

    verifiedBtn: {
        backgroundColor: '#E2F7EE',
        borderWidth: 1.5,
        borderColor: colors.stepDone,
    },

    verifyText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
    },

    verifiedText: {
        color: colors.primary,
    },

    otpLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.labelColor,
        marginTop: 8,
        marginBottom: 4,
    },

    errorText: {
        color: colors.errorRed,
        fontSize: 11,
        marginTop: 3,
    },

    nextBtn: {
        borderRadius: 40,
        overflow: 'hidden',
        marginTop: 24,
        marginBottom: 30,
    },

    nextBtnGrad: {
        padding: 14,
        alignItems: 'center',
    },

    nextBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 14,
    },

    uploadBtn: {
        backgroundColor: colors.inputBg,
        borderWidth: 1.5,
        borderColor: '#9FD4BE',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
    },

    uploadText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 13,
    },

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 14,
        marginBottom: 6,
    },

    divider: {
        borderTopWidth: 1,
        borderColor: '#EAF2EE',
        marginVertical: 14,
    },

    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

});