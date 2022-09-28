import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import Item from './Item';
import Select from './controls/Select';

import { localPath, basePath, joinPath } from '../system';
import data from '../data.json';

class Editor extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  change = (data, name) => {
    return value => {
      data[name] = value;
      this.props.onChange({...this.props.settings});
    };
  };

  render () {
    const {settings} = this.props;
    const platform = settings.__internal.platform;
    const base = settings.application.datadir !== '$BASE/data' ? settings.application.datadir : basePath(platform);
      debugger;

    /*
    // handle config dependencies here
    if (settings.network.peerblockfilters === 1 && settings.core.blockfilterindex !== "1") {
      settings.core.blockfilterindex = "1";
    }
    */

    return (
      <div>
        { this.select('__internal', 'platform') }

        <Section title={data.application.section} description={data.application.description}>
          { this.path('application', 'datadir', base, platform) }
          { this.path('application', 'logdir', base, platform) }
          { this.number('application', 'maxlogfiles') }
          { this.number('application', 'maxlogfilesize') }
          { this.text('application', 'acceptortimeout') }

          { this.path('application', 'tlscertpath', base, platform) }
          { this.path('application', 'tlskeypath', base, platform) }
          { this.text('application', 'tlsextraip') }
          { this.text('application', 'tlsextradomain') }
          { this.flag('application', 'tlsautorefresh') }

          { this.text('application', 'tlscertduration') }
          { this.flag('application', 'tlsdisableautofill') }
          { this.text('application', 'externalhosts') }
          { this.path('application', 'letsencryptdir', base, platform) }
          { this.text('application', 'letsencryptlisten') }
          { this.text('application', 'letsencryptdomain') }

          { this.flag('application', 'no-macaroons') }
          { this.flag('application', 'sync-freelist') }
          { this.path('application', 'adminmacaroonpath', base, platform) }
          { this.path('application', 'readonlymacaroonpath', base, platform) }
          { this.path('application', 'invoicemacaroonpath', base, platform) }

          { this.select('application', 'coin-selection-strategy') }
          { this.text('application', 'payments-expiration-grace-period') }
          { this.text('application', 'listen') }
          { this.flag('application', 'nolisten') }
          { this.text('application', 'rpclisten') }
          { this.text('application', 'restlisten') }
          { this.text('application', 'restcors') }
          { this.text('application', 'externalip') }
          { this.flag('application', 'nat') }
          { this.flag('application', 'norest') }
          { this.flag('application', 'no-rest-tls') }

          { this.text('application', 'addpeer') }
          { this.text('application', 'ws-ping-interval') }
          { this.text('application', 'ws-pong-wait') }
          { this.text('application', 'minbackoff') }
          { this.text('application', 'maxbackoff') }
          { this.text('application', 'connectiontimeout') }

          { this.text('application', 'debuglevel') }
          { this.text('application', 'cpuprofile') }
          { this.text('application', 'profile') }

          { this.flag('application', 'unsafe-disconnect') }
          { this.flag('application', 'unsafe-replay') }
          { this.number('application', 'maxpendingchannels') }

          { this.path('application', 'backupfilepath', base, platform) }
          { this.number('application', 'blockcachesize') }
          { this.text('application', 'feeurl') }
          { this.flag('application', 'nobootstrap') }
          { this.flag('application', 'noseedbackup') }
          { this.text('application', 'wallet-unlock-password-file') }
          { this.flag('application', 'wallet-unlock-allow-create') }
          { this.flag('application', 'reset-wallet-transactions') }

          { this.number('application', 'minchansize') }
          { this.number('application', 'maxchansize') }
          { this.number('application', 'coop-close-target-confs') }
          { this.text('application', 'channel-commit-interval') }
          { this.text('application', 'pending-commit-interval') }
          { this.number('application', 'channel-commit-batch-size') }
          { this.flag('application', 'keep-failed-payment-attempts') }
          { this.number('application', 'default-remote-max-htlcs') }
          { this.text('application', 'chan-enable-timeout') }
          { this.text('application', 'chan-disable-timeout') }
          { this.text('application', 'chan-status-sample-interval') }

          { this.flag('application', 'height-hint-cache-query-disable') }
          { this.text('application', 'historicalsyncinterval') }
          { this.flag('application', 'ignore-historical-gossip-filters') }
          { this.flag('application', 'rejectpush') }
          { this.flag('application', 'rejecthtlc') }
          { this.flag('application', 'requireinterceptor') }
          { this.flag('application', 'stagger-initial-reconnect') }

          { this.flag('application', 'max-cltv-expiry') }
          { this.number('application', 'max-channel-fee-allocation') }
          { this.number('application', 'max-commit-fee-rate-anchors') }
          { this.number('application', 'dust-threshold') }

          { this.flag('application', 'dry-run-migration') }
          { this.flag('application', 'enable-upfront-shutdown') }
          { this.flag('application', 'accept-keysend') }
          { this.flag('application', 'keysend-hold-time') }
          { this.flag('application', 'accept-amp') }
          { this.flag('application', 'gc-canceled-invoices-on-startup') }
          { this.flag('application', 'gc-canceled-invoices-on-the-fly') }
          { this.flag('application', 'allow-circular-route') }
          { this.number('application', 'trickledelay') }
          { this.number('application', 'numgraphsyncpeers') }
          { this.flag('application', 'prometheus.enable') }
          { this.text('application', 'prometheus.listen') }
          { this.flag('application', 'prometheus.perfhistograms') }
          { this.text('application', 'alias') }
          { this.text('application', 'color') }
        </Section>

      </div>
    );
  }

  select (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description[value], value, `${section}.${prop}`);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
      >
        <Select
          onChange={this.change(settings[section], prop)}
          value={value}
          values={data[section][prop].values.map(val)}
          id={`${configMode}_${prop}`}
          disabled={!isEnabled}
        />
      </Item>
    );
  }

  multiselect (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const current = settings[section][prop];
    var description;

    if (current === undefined || current.length === 0) {
      description = '';
    } else {
      description = fillDescription(data[section][prop].description, current);
    }

    const change = (val) => (ev) => {
      const {checked} = ev.target;
      const newValue = [...current];
      const idx = newValue.indexOf(val);

      if (checked) {
        newValue.push(val);
      } else if (idx !== -1) {
        newValue.splice(idx, 1);
      }
      this.change(settings[section], prop)(newValue);
    };

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        large
        >
        {data[section][prop].values.map(val).map(value => {
          const id = `${configMode}_${section}_${prop}_${value.value}`;

          return (
            <label className='mdl-switch mdl-js-switch' htmlFor={id} key={value.name}>
              <input
                type='checkbox'
                id={id}
                className='mdl-switch__input'
                checked={current.indexOf(value.value) !== -1}
                disabled={!isEnabled}
                onChange={change(value.value)}
                />
              <span className='mdl-switch__label'>{value.name}</span>
            </label>
          );
        })}
      </Item>
    );
  }

  number (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
      >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='number'
            value={value || 0}
            onChange={(ev) => this.change(settings[section], prop)(Number(ev.target.value))}
            min={data[section][prop].min}
            max={data[section][prop].max}
            disabled={!isEnabled}
          />
          <span className='mdl-textfield__error'>Please provide a valid number (min: {data[section][prop].min}, max: {data[section][prop].max})</span>
        </div>
      </Item>
    );
  }

  decimal (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
      >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='number'
            step='0.00000001'
            value={value || 0}
            onChange={(ev) => this.change(settings[section], prop)(Number(ev.target.value))}
            min={data[section][prop].min}
            max={data[section][prop].max}
            disabled={!isEnabled}
          />
          <span className='mdl-textfield__error'>Please provide a valid number (min: {data[section][prop].min}, max: {data[section][prop].max})</span>
        </div>
      </Item>
    );
  }

  path (section, prop, base, platform, isEnabled = true) {
    return this.text(section, prop, isEnabled, value => {
        if (prop === 'datadir') {
            console.log(' --- ', value, base, platform);
            debugger;
        }
      if (!value) {
        return value;
      }
      value = value.replace('$LOCAL', localPath(platform));
      value = value.replace('$BASE', base);
      // normalize separators
      value = joinPath(value.split('\\'), platform);
      value = joinPath(value.split('/'), platform);
      return value;
    });
  }

  text (section, prop, isEnabled = true, processValue = x => x) {
    check(section, prop);
    const {settings} = this.props;
    const value = processValue(or(settings[section][prop], data[section][prop].default));
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
      >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='text'
            value={value || ''}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.value)}
            disabled={!isEnabled}
          />
        </div>
      </Item>
    );
  }

  flag (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);
    const id = `${configMode}_${section}_${prop}`;

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <label className='mdl-switch mdl-js-switch' htmlFor={id}>
          <input
            type='checkbox'
            id={id}
            className='mdl-switch__input'
            checked={value}
            disabled={!isEnabled}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.checked ? 1 : 0)}
          />
          <span className='mdl-switch__label' />
        </label>
      </Item>
    );
  }

  list (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value.toString());

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
      >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          {value.map((v, idx) => (
            <input
              disabled={!isEnabled}
              key={idx}
              className='mdl-textfield__input'
              type='text'
              value={v || ''}
              onChange={(ev) => {
                const newValue = [...value];
                if (ev.target.value !== '') {
                  newValue[idx] = ev.target.value;
                } else {
                  delete newValue[idx];
                }
                this.change(settings[section], prop)(newValue);
              }}
            />
          ))}
          <br />
          <button
            style={{bottom: 0, right: 0, zIndex: 10, transform: 'scale(0.5)'}}
            className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect'
            onClick={() => this.change(settings[section], prop)(value.concat(['']))}
            disabled={!isEnabled}
          >
            <i className='material-icons'>add</i>
          </button>
        </div>
      </Item>
    );
  }
}

export function fillDescription (description, value, key) {
  if (!description) {
    console.warn(`Cant find description for: value:${value} at ${key}`);
    return 'unknown entry';
  }

  if (typeof description === 'object') {
    // If the description value is an array, concatenate the descriptions
    if (Array.isArray(value)) {
      var formatted = '';
      for (var val in value) {
        if ({}.hasOwnProperty.call(value, val)) {
          formatted += description[value[val]] + ',';
        }
      }
      // remove trailing comma
      formatted = formatted.replace(/(,$)/g, "");
      return formatted;
    }
    // If there is a single value and it exists in the description mapping, return it
    if (description[value] !== undefined) {
      return description[value];
    }
    return description.value;
  }
  return description.replace(/{}/g, value || '');
}

function or (value, def) {
  if (value === undefined) {
    return def;
  }
  return value;
}

function check (section, prop) {
  if (!data[section][prop]) {
    throw new Error(`Can't find data for ${section}.${prop}`);
  }
}

function val (data) {
  const match = data.match(/(.+)\s+\[(.+)]/);
  if (!match) {
    return { name: data, value: data };
  }

  return {
    name: match[1],
    value: match[2]
  };
}

export default Editor;
