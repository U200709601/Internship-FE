import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { useTranslation } from 'react-i18next';
import PortOut from './PortOut';
// ----------------------------------------------------------------------


export default function PortOuts() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('port-out'), component: <PortOut/> },
        
    ];

    const TITLE = t('port-out-requests');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
