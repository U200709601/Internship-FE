import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { useTranslation } from 'react-i18next';
import InboundRates from './InboundRates';
import OutBoundVoiceRates from './OutBoundVoiceRates';
import OutBoundSmsRates from './OutBoundSmsRates';

// ----------------------------------------------------------------------


export default function Pricing() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('inbound-rates'), component: <InboundRates/> },
        { id: 1, label: t('outbound-voice-rates'), component: <OutBoundVoiceRates /> },
        { id: 1, label: t('outbound-sms-rates'), component: <OutBoundSmsRates /> },
    ];

    const TITLE = 'Pricing';

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
