import { Profile } from '@/types/user-types';
import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback, DimensionValue } from 'react-native';
import { useTheme } from 'tamagui';


interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: string

}

const AppModal = ({ visible, onClose, children, height = '70%' }: AppModalProps) => {

    const theme = useTheme()
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContent, { backgroundColor: theme.background.val, height: height as DimensionValue }]}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        width: '100%',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingTop: 20,
        paddingHorizontal: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default AppModal;