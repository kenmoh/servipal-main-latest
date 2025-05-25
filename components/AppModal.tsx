import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'tamagui';


interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AppModal = ({ visible, onClose, children }: AppModalProps) => {

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
                    <Text>ken</Text>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContent, { backgroundColor: theme.background.val }]}>
                            <TouchableWithoutFeedback style={{

                                position: 'absolute',
                                top: 20,
                                right: 30
                            }}>
                                <X color={theme.icon.val} />
                            </TouchableWithoutFeedback>
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
        height: '70%',
        width: '100%',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppModal;