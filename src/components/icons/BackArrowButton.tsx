import { StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const backArrowXml = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.0374 6.51665H3.28489L7.98249 1.69276C8.35791 1.30724 8.35791 0.674598 7.98249 0.289081C7.89343 0.197444 7.78765 0.124742 7.6712 0.0751373C7.55475 0.0255328 7.42991 0 7.30384 0C7.17777 0 7.05293 0.0255328 6.93648 0.0751373C6.82003 0.124742 6.71425 0.197444 6.62519 0.289081L0.281513 6.80332C0.192275 6.89477 0.121476 7.00339 0.0731705 7.12297C0.0248647 7.24256 0 7.37075 0 7.50021C0 7.62967 0.0248647 7.75786 0.0731705 7.87745C0.121476 7.99703 0.192275 8.10565 0.281513 8.1971L6.62519 14.7113C6.71431 14.8029 6.82011 14.8755 6.93656 14.925C7.053 14.9745 7.1778 15 7.30384 15C7.42988 15 7.55468 14.9745 7.67112 14.925C7.78756 14.8755 7.89337 14.8029 7.98249 14.7113C8.07161 14.6198 8.1423 14.5112 8.19054 14.3916C8.23877 14.272 8.26359 14.1439 8.26359 14.0144C8.26359 13.885 8.23877 13.7569 8.19054 13.6373C8.1423 13.5177 8.07161 13.4091 7.98249 13.3175L3.28489 8.49365H14.0374C14.5668 8.49365 15 8.04883 15 7.50515C15 6.96148 14.5668 6.51665 14.0374 6.51665Z" fill="#667085"/>
</svg>`;

type Props = {
  onPress: () => void;
};

export default function BackArrowButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <SvgXml xml={backArrowXml} width={15} height={15} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 26,
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
});
