import Awesomplete = require("awesomplete");
import { Field, FormikProps } from "formik";
import * as _ from "lodash";
import * as React from "react";
import { Listable } from "../../../common/Listable";
import { Button } from "../../Components/Button";
import { Listing } from "../../Library/Listing";
import { Toggle } from "../../Settings/components/Toggle";

interface IdentityFieldsProps {
  formApi: FormikProps<any>;
  allowFolder: boolean;
  allowSaveAs: boolean;
  setEditorMode: (editorMode: "standard" | "json") => void;
  currentListings?: Listing<Listable>[];
}

interface IdentityFieldsState {
  folderExpanded: boolean;
}

export class IdentityFields extends React.Component<
  IdentityFieldsProps,
  IdentityFieldsState
> {
  private folderInput: HTMLInputElement;
  private autoCompletePaths: string[];
  private initializedAutocomplete = false;

  constructor(props) {
    super(props);
    this.autoCompletePaths = _.uniq(
      this.props.currentListings &&
        this.props.currentListings.map(l => l.Listing().Path)
    );

    const folderExpanded =
      this.props.formApi.values["Path"] &&
      this.props.formApi.values["Path"].length > 0;

    this.state = {
      folderExpanded
    };
  }

  public componentDidUpdate() {
    if (!this.folderInput || this.initializedAutocomplete) {
      return;
    }

    const awesomeplete = new Awesomplete(this.folderInput, {
      list: this.autoCompletePaths,
      minChars: 1
    });

    this.folderInput.addEventListener("awesomplete-select", (event: any) => {
      this.props.formApi.setFieldValue("Path", event.text.value);
      event.preventDefault();
      awesomeplete.close();
    });

    this.initializedAutocomplete = true;
  }

  public render() {
    return (
      <React.Fragment>
        <div className="c-statblock-editor__path-and-name">
          {this.folderElement()}
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <Field type="text" name="Name" id="name" />
          </div>
        </div>
        {this.props.allowSaveAs && (
          <div className="c-statblock-editor__save-as">
            <Toggle fieldName="SaveAs">Save as a copy</Toggle>
            {this.props.formApi.errors.PathAndName}
          </div>
        )}
        <div className="c-statblock-editor__mode-toggle">
          <label>Editor Mode:</label>
          <Button
            onClick={() => this.props.setEditorMode("standard")}
            text="Standard"
          />
          <Button
            additionalClassNames="c-statblock-editor__json-button"
            onClick={() => this.props.setEditorMode("json")}
            text="JSON"
          />
        </div>
      </React.Fragment>
    );
  }

  private folderElement = () => {
    if (!this.props.allowFolder) {
      return null;
    }
    if (this.state.folderExpanded) {
      return (
        <div className="inline">
          <span
            className="statblock-editor__folder-button fa-clickable fa-times"
            onClick={() => this.setState({ folderExpanded: false })}
          />
          <div>
            <label className="label" htmlFor="Path">
              Folder
            </label>
            <Field
              type="text"
              name="Path"
              innerRef={i => (this.folderInput = i)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <span
          className="statblock-editor__folder-button fa-clickable fa-folder"
          title="Move to folder"
          onClick={() => this.setState({ folderExpanded: true })}
        />
      );
    }
  };
}
